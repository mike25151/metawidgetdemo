( function() {

	'use strict';

	/**
	 * Controllers
	 */

	angular.module( 'app' ).controller( 'simpleController', function( $scope ) {

		/**
		 * Metawidget config.
		 */
		
		$scope.metawidgetConfig = {

			/**
			 * Use JSON Schema so we can describe an array's metadata even
			 * though it's empty. If you only care about non-empty arrays, you
			 * could skip this and Metawidget will read metadata from the first
			 * item in the array.
			 */

			inspector: new metawidget.inspector.JsonSchemaInspector( {
				properties: {
					firstname: {
						type: 'string'
					},
					surname: {
						type: 'string'
					},
          sex: {
            enum: [ 'Male', 'Female', 'Other' ],
            componentType: 'radio'
          },
          address: {
            properties: {
              street: {
                type: 'string',
              },
              suburb: {
                type: 'string'
              },
              state: {
                enum: [ 'ACT', 'QLD', 'NSW', 'VIC', 'TAS',
									'SA', 'WA', 'NT', 'Other' ]
              },
							postcode: {
              	type: 'number'
							},
            }
          },
          conditions: {
            enum: [ 'Yes', 'No'],
            componentType: 'radio'
          },
          condition: {
            enum: [ 'Diabetes', 'High cholesterol', 'Heart disease',
							'Respiratory disorder', 'Immune system disorder' ],
            hidden: '{{person.conditions != "Yes"}}'
          },
					children: {
						type: 'array',
						items: {
							properties: {
								firstname: {
									type: 'string'
								},
								surname: {
									type: 'string'
								}
							}
						}
					},
					edit: {
						type: 'function',
						hidden: '{{!readOnly}}'
					},
					save: {
						type: 'function',
						hidden: '{{readOnly}}'
					}
				}
			} ),

			/**
			 * Custom WidgetBuilder to instantiate our custom directive.
			 */

			widgetBuilder: new metawidget.widgetbuilder.CompositeWidgetBuilder( [ function( elementName, attributes, mw ) {

				// Editable tables

				if ( attributes.type === 'array' && !metawidget.util.isTrueOrTrueString( attributes.readOnly ) ) {

					var typeAndNames = metawidget.util.splitPath( mw.path );

					if ( typeAndNames.names === undefined ) {
						typeAndNames.names = [];
					}

					typeAndNames.names.push( attributes.name );
					typeAndNames.names.push( '0' );

					var inspectionResult = mw.inspect( mw.toInspect, typeAndNames.type, typeAndNames.names );
					var inspectionResultProperties = metawidget.util.getSortedInspectionResultProperties( inspectionResult );
					var columns = '';

					for ( var loop = 0, length = inspectionResultProperties.length; loop < length; loop++ ) {

						var columnAttribute = inspectionResultProperties[loop];

						if ( metawidget.util.isTrueOrTrueString( columnAttribute.hidden ) ) {
							continue;
						}

						if ( columns !== '' ) {
							columns += ',';
						}
						columns += columnAttribute.name;
					}

					var widget = $( '<table>' ).attr( 'edit-table', '' ).attr( 'columns', columns ).attr( 'ng-model', mw.path + '.' + attributes.name );
					return widget[0];
				}
			}, new metawidget.widgetbuilder.HtmlWidgetBuilder() ] ),
			addWidgetProcessors: [ new metawidget.bootstrap.widgetprocessor.BootstrapWidgetProcessor() ],
			layout: new metawidget.bootstrap.layout.BootstrapDivLayout()
		}

		/**
		 * Model.
		 */

		$scope.person = {
      children: [],
			edit: function() {
				$scope.readOnly = false;
			},
			save: function() {
				$scope.readOnly = true;
				alert( JSON.stringify( $scope.person ) );
			}
		};
		
		$scope.readOnly = true;

	} );
} )();
