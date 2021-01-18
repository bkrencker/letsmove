namespace letsmove;

using { managed, cuid } from '@sap/cds/common';

entity ActivityTypes : managed {
  key code: String;
  title: String @title: 'Activity';
}

entity Units : managed {
  key code: String;
  title: String @title: 'Unit';
}

entity Activities : cuid, managed {
  type: Association to one ActivityTypes @title: 'Activity';
  distance: Decimal(6, 2) @title: 'Distance';
  uom: Association to one Units @title: 'Unit of Measure';
  nickname: String @title: 'Nickname';

  company: Association to one Companies @title: 'Company';

  imageUrl: String @Core.Computed: true @UI.IsImageURL: true;
}

entity TargetActivities {
  key unit: Association to one Units @title: 'Unit';
  distance: Decimal(12, 2) @title: 'Distance';
}

entity Countries : managed {
  key code: String @title: 'Country';
  title: String @title: 'Country';

  companies: Composition of many Companies on companies.country = $self;
}

entity Companies : managed {
  key code: String @title: 'Company';
  title: String @title: 'Company';

  country: Association to one Countries @title: 'Country';
  activities: Association to many Activities on activities.company = $self;
}
