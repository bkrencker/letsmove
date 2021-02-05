using letsmove as letsmove from '../db/data-model';

annotate CatalogService.Activities {
      nickname @Analytics.Dimension: true;
      distance @Analytics.Measure: true;
    };


service CatalogService {
    @insertonly entity Activities as projection on letsmove.Activities;

    @readonly view RecentActivities as select from letsmove.Activities { * } order by createdAt desc limit 10;

    @readonly view TotalByActivityType as select from letsmove.Activities {
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

    @readonly view TotalByCompany as select from letsmove.Activities {
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

    @readonly view TotalByCountry as select from letsmove.Activities {
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


    @readonly view TotalActivity as select from letsmove.Activities CROSS JOIN TargetActivities {
      round( sum(
        case
          when uom.code = 'mi' then Activities.distance * 1.60934
          else
            Activities.distance
        end
      ), 2) as totalKm: Decimal(10,2),
      round( sum(
        case
          when uom.code = 'km' then Activities.distance * 0.62137
          else
            Activities.distance
        end
      ), 2) as totalMi: Decimal(10,2),
      TargetActivities.distance as TargetActivitiesKm: Decimal(10,2),
      round(TargetActivities.distance * 0.62137, 2) as TargetActivitiesMi: Decimal(10,2)

    }
    where type.code is not null
    group by TargetActivities.distance;

    @readonly view TotalByMonthChart as select from TotalByMonth as _outer {
      substring(_outer.monthString, 0, 3) as month: String,
      coalesce(round(( select totalKm from TotalByMonth where type.code = 'swim' and monthString = _outer.monthString )), 0) as totalKm_swim: Integer,
      coalesce(round(( select totalKm from TotalByMonth where type.code = 'bike' and monthString = _outer.monthString )), 0) as totalKm_bike: Integer,
      coalesce(round(( select totalKm from TotalByMonth where type.code = 'run' and monthString = _outer.monthString )), 0) as totalKm_run: Integer,
      coalesce(round(( select totalKm from TotalByMonth where type.code = 'walk' and monthString = _outer.monthString )), 0) as totalKm_walk: Integer,
      coalesce(round(( select totalKm from TotalByMonth where type.code = 'skate' and monthString = _outer.monthString )), 0) as totalKm_skate: Integer,
      coalesce(round(( select totalKm from TotalByMonth where type.code = 'other' and monthString = _outer.monthString )), 0) as totalKm_other: Integer
    } group by _outer.monthString;

    @readonly view TotalByMonth as select from TotalByMonthRaw {
      monthString,
      type,
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
    } group by monthString, type;

    @readonly view TotalByMonthRaw as select from letsmove.Activities {
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
      company
    };

    @readonly view CompaniesView as select from Companies {
      key code as CompanyCode,
      key country.code as CountryCode,
      key country.title as CountryTitle,
      title as CompanyTitle
    };

    @readonly entity Countries as projection on letsmove.Countries;
    @readonly entity Companies as projection on letsmove.Companies;
    @readonly entity Units as projection on letsmove.Units;
    @readonly entity ActivityTypes as projection on letsmove.ActivityTypes;
    @readonly entity TargetActivities as projection on letsmove.TargetActivities;
}
