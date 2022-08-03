const DBController = require("../../controllers/db_controller.js");
const software_ref = require("../../db/software_ref.json");

describe("DBController", () => {
  jest.useFakeTimers();
  let dbc;
  beforeEach(() => {
    
    dbc = new DBController(); //FIXME: need to mock mysql connection or otherwise mock timers.
  })

  it("should construct a new DBController instance when initialized", () => {
    const dbcInst = new DBController();
    expect(dbcInst).toBeInstanceOf(DBController);
  });

  describe("getSoftwareDetailsById", () => {
    it("should accept an id parameter that is a number", () => {

    })

    it("should return the details for an item if the id is valid", () => {
      let sampleId = 2;
      let sampleDetails = software_ref[sampleId];

      expect(dbc.getSoftwareDetailsById(sampleId)).toEqual(sampleDetails);
    })

    it("should return an error string if the id provided is not in the database", () => {
      expect(dbc.getSoftwareDetailsById(99)).toEqual("ERR: No software with that ID");
    })
  });
});