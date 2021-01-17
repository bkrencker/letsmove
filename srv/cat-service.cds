using letsmove as letsmove from '../db/data-model';

annotate CatalogService.Activities {
      nickname @Analytics.Dimension: true;
      distance @Analytics.Measure: true;
    };


service CatalogService {
    entity Activities as projection on letsmove.Activities;

    view TotalByActivityType as select from Activities {
      type.code,
      type.title,
      round( sum(
        case
          when uom.code = 'mi' then distance * 1.60934
          else
            distance
        end
      ), 2) as totalKm: Decimal(10,2),
      round( sum(
        case
          when uom.code = 'km' then distance * 0.62137
          else
            distance
        end
      ), 2) as totalMi: Decimal(10,2)
    }
    group by
      type.code,
      type.title;

    view TotalByCompany as select from Activities {
      company.code,
      company.title,
      round( sum(
        case
          when uom.code = 'mi' then distance * 1.60934
          else
            distance
        end
      ), 2) as totalKm: Decimal(10,2),
      round( sum(
        case
          when uom.code = 'km' then distance * 0.62137
          else
            distance
        end
      ), 2) as totalMi: Decimal(10,2)
    }
    group by
      company.code,
      company.title;

    view TotalByCountry as select from Activities {
      company.country.code,
      company.country.title,
      round( sum(
        case
          when uom.code = 'mi' then distance * 1.60934
          else
            distance
        end
      ), 2) as totalKm: Decimal(10,2),
      round( sum(
        case
          when uom.code = 'km' then distance * 0.62137
          else
            distance
        end
      ), 2) as totalMi: Decimal(10,2)
    }
    group by
      company.country.code,
      company.country.title;


    view TotalActivity as select from Activities   {
      round( sum(
        case
          when uom.code = 'mi' then distance * 1.60934
          else
            distance
        end
      ), 2) as totalKm: Decimal(10,2),
      round( sum(
        case
          when uom.code = 'km' then distance * 0.62137
          else
            distance
        end
      ), 2) as totalMi: Decimal(10,2)
    };

    view TotalByMonth as select from Activities {
      key ID,

      extract (year from createdAt) as year: String,
      extract (month from createdAt) as month: String,
      extract (year from createdAt) || '-' || lpad( extract (month from createdAt), 2, 0 ) as formattedDate: String,

      case extract (month from createdAt)
        when 1 then 'January'
        when 2 then 'February'
        when 3 then 'March'
        when 4 then 'April'
        when 5 then 'May'
        when 6 then 'June'
        when 7 then 'July'
        when 8 then 'August'
        when 9 then 'September'
        when 10 then 'October'
        when 11 then 'November'
        when 12 then 'December'
        else ''
      end as monthString: String,

      case extract (month from createdAt)
        when 1 then 'January'
        when 2 then 'February'
        when 3 then 'March'
        when 4 then 'April'
        when 5 then 'May'
        when 6 then 'June'
        when 7 then 'July'
        when 8 then 'August'
        when 9 then 'September'
        when 10 then 'October'
        when 11 then 'November'
        when 12 then 'December'
        else ''
      end || ' (' || extract (year from createdAt) || ')' as monthYearString: String,

      createdAt,
      createdBy,
      modifiedAt,
      modifiedBy,

      nickname,
      distance,
      uom,
      type,
      imageUrl,
      company
    };

    view CompaniesView as select from Companies {
      key code as CompanyCode,
      key country.code as CountryCode,
      key country.title as CountryTitle,
      title as CompanyTitle
    };

    @readonly entity Countries as projection on letsmove.Countries;
    @readonly entity Companies as projection on letsmove.Companies;
    @readonly entity Units as projection on letsmove.Units;
    @readonly entity ActivityTypes as projection on letsmove.ActivityTypes;
}
