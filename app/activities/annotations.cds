using AdminService as service from '../../srv/admin-service';

using {
    cuid
} from '@sap/cds/common';

annotate cuid with {
    ID @(
        title : '{i18n>ID}',
        UI.HiddenFilter,
        Core.Computed
    );
}

// Make Entity editable
annotate service.Activities with @odata.draft.enabled;

annotate service.Activities with @(
  UI.SelectionFields  : [
      type_code
  ],
  UI.HeaderInfo  : {
      $Type : 'UI.HeaderInfoType',
      TypeName : 'Activity',
      TypeNamePlural : 'Activities',
      Title : {
          $Type : 'UI.DataField',
          Value : type.title,
      },
      Description : {
          $Type : 'UI.DataField',
          Value : nickname,
      },
  },
  UI.LineItem : [
    {
      $Type : 'UI.DataField',
      Value : nickname,
    },
    {
      $Type : 'UI.DataField',
      Value : type.title,
    },
    {
        $Type : 'UI.DataField',
        Value : company.title,
    },
    {
        $Type : 'UI.DataField',
        Value : company.country.title,
    },
    {
      $Type : 'UI.DataField',
      Value : distance,
    },
    {
      $Type : 'UI.DataField',
      Value : uom_code,
    },
    {
        $Type : 'UI.DataField',
        Value : createdAt,
    },
  ],
  UI.Facets  : [
      {
          $Type : 'UI.ReferenceFacet',
          Target : '@UI.FieldGroup#Main',
      },
  ],
  UI.FieldGroup #Main: {
    $Type : 'UI.FieldGroupType',
    Data : [
        {
            $Type : 'UI.DataField',
            Value : nickname,
        },{
            $Type : 'UI.DataField',
            Value : distance,
        },{
            $Type : 'UI.DataField',
            Value : uom_code,
        },{
            $Type : 'UI.DataField',
            Value : type_code,
        },
    ],
  }
);

annotate service.Activities with {
  // show as dropdown instead of F4 PopUp
  type @Common.ValueListWithFixedValues;
  uom @Common.ValueListWithFixedValues;

  // Alle Audit Felder als Filter zulassen
  createdAt @UI.HiddenFilter:false;
	createdBy @UI.HiddenFilter:false;
  modifiedAt @UI.HiddenFilter:false;
  modifiedBy @UI.HiddenFilter:false;
};

// Enable F4 Value Help and Semantic Key
annotate service.Units with @( cds.odata.valuelist: true, Common.SemanticKey : [ title ] );

// Enable F4 Value Help and Semantic Key
annotate service.ActivityTypes with @( cds.odata.valuelist: true, Common.SemanticKey : [ title ] );

