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
