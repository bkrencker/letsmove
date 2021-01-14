using letsmove as letsmove from '../db/data-model';

service CatalogService {
    @readonly entity Books as projection on letsmove.Books;

    entity Activities as projection on letsmove.Activities;

    view TotalActivity as select from Activities {
      round( sum(
        case
          when uom = 'mi' then distance * 1.60934
          else
            distance
        end
      ), 2) as totalKm: Decimal(10,2),
      round( sum(
        case
          when uom = 'km' then distance * 0.62137
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
}
