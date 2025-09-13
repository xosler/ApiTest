export const validatePOI = (poi) => {
  expect(poi).to.have.property('AddressInfo');
  expect(poi.AddressInfo).to.have.property('Latitude');
  expect(poi.AddressInfo).to.have.property('Longitude');
};

export const validateChargerType = (type) => {
          expect(type).to.have.property('Comments');
          expect(type).to.have.property('IsFastChargeCapable');
          expect(type).to.have.property('ID');
          expect(type).to.have.property('Title');

          expect(type.Comments).to.be.a('string');
          expect(type.IsFastChargeCapable).to.be.a('boolean');
          expect(type.ID).to.be.a('number');
          expect(type.Title).to.be.a('string');     
};