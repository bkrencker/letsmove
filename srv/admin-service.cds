using letsmove as letsmove from '../db/data-model';

service AdminService {

    entity Activities as projection on letsmove.Activities;

    @readonly entity Countries as projection on letsmove.Countries;
    @readonly entity Companies as projection on letsmove.Companies;

    // make readonly because of hard-coded dependencies
    @readonly entity ActivityTypes as projection on letsmove.ActivityTypes;
    @readonly entity Units as projection on letsmove.Units;
}
