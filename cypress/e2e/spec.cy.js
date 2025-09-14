import { validatePOI, validateChargerType } from '../support/utils';


describe('Open Charge Map API', () => {

  const EXPECTED_RESPONSE_TIME = 1000

  it('GET /poi - should return valid points of interest', () => {

    cy.getPOIs({ latitude: 37.415328, longitude: -122.076575, distance: 5, maxresults: 5 })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.duration).to.be.lessThan(EXPECTED_RESPONSE_TIME);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);

        response.body.forEach((poi) => validatePOI(poi));
      });
  });

  it('GET /referencedata - should return reference data', () => {
    cy.getReferenceData()
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.duration).to.be.lessThan(EXPECTED_RESPONSE_TIME);

        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('ChargerTypes');

        response.body.ChargerTypes.forEach(type => validateChargerType(type));

        cy.validateApiProperties(response, [
          'ConnectionTypes',
          'CurrentTypes',
          'Countries',
          'DataProviders',
          'Operators',
          'StatusTypes',
          'SubmissionStatusTypes',
          'UsageTypes',
          'UserCommentTypes',
          'CheckinStatusTypes',
          'DataTypes',
          'MetadataGroups',
          'UserProfile',
          'ChargePoint',
          'UserComment'
        ]);

      });
  });

});
