using letsmove as letsmove from '../db/data-model';

service CatalogService {
    entity Activities as projection on letsmove.Activities;

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
      key ID as CompanyId,
          title as CompanyTitle,

          country.title as CountryTitle
    };

    @readonly entity Countries as projection on letsmove.Countries;
    @readonly entity Companies as projection on letsmove.Companies;
    @readonly entity Units as projection on letsmove.Units;
    @readonly entity ActivityTypes as projection on letsmove.ActivityTypes;
}
