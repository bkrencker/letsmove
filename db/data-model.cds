namespace letsmove;

using { managed, cuid } from '@sap/cds/common';

entity Books {
  key ID : Integer;
  title  : String;
  stock  : Integer;
}

entity Activities : cuid, managed {
  type: String enum { walk; run; bike; swim; skate; surf; ski; other; };
  distance: Decimal(6, 2);
  uom: String enum { km; mi; };
  nickname: String;
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
