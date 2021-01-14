namespace letsmove;

using { managed, cuid } from '@sap/cds/common';

entity Books {
  key ID : Integer;
  title  : String;
  stock  : Integer;
}

entity ActivityTypes : managed {
  key code: String;
  title: String @title: 'Activity';
}

entity Units : managed {
  key code: String;
  title: String @title: 'Unit';
}

entity Activities : cuid, managed {
  //type: String enum { walk; run; bike; swim; skate; surf; ski; other; };
  type: Association to one ActivityTypes @title: 'Activity';
  distance: Decimal(6, 2) @title: 'Distance';
  uom: Association to one Units @title: 'Unit of Measure';
  nickname: String @title: 'Nickname';
}

entity Countries : cuid, managed {
  isocode: String;
  title: String;

  companies: Composition of many Companies on companies.country = $self;
}

entity Companies : cuid, managed {
  code: String;
  title: String;

  country: Association to one Countries;
}
