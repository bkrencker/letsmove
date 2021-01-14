using letsmove as letsmove from '../db/data-model';

service CatalogService {
    @readonly entity Books as projection on letsmove.Books;

    @insertonly entity Activities as projection on letsmove.Activities;

    view TotalActivity as select from Activities {
      sum(
        case
          when uom = 'mi' then distance * 1.61
        end
      ) as totalKm: Decimal(10,2),
      sum(
        case
          when uom = 'km' then distance * 0.62
        end
      ) as totalMi: Decimal(10,2)
    };

    view CompaniesView as select from Companies {
      key ID as CompanyId,
          title as CompanyTitle,

          country.title as CountryTitle
    };

    @readonly entity Countries as projection on letsmove.Countries;
    @readonly entity Companies as projection on letsmove.Companies;
}
