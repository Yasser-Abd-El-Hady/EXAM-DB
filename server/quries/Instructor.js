//every thing related to instructor
const sql = require('mssql');
const {
  MSSQLConnection,
} = require('../database/nativeConnection/dbNativeConnection.js');
const {
  DBProcedureDictionary,
} = require('../database/dbDictionary/procedureDictionary.js');
const {
  createInsertInstructorUserProc,
  getAllInstructorsProc,
  deleteInstructorProc,
  getInstructorStudentsProc,
} = require('../procedures/User.instructor.js');

/**
 * @param {string} first_name
 * @param {string} last_name
 * @param {string} email
 * @param {string} password
 * @param {string} phone_number
 * @param {number} salary
 * @param {number} crs_id
 * @param {number} dept_id
 * @desc  use a stored procedure [insertInstructor] to return promise of rowsAffected
 *
 * @returns {sql.IResult<any>.rowsAffected}
 */
module.exports.insertInstructorRecord = async function (
  first_name,
  last_name,
  email,
  password,
  phone_number,
  salary,
  crs_id,
  dept_id
) {
  console.log(typeof first_name);
  console.log(typeof last_name);
  console.log(typeof email);
  console.log(typeof password);
  console.log(typeof phone_number);
  console.log(typeof salary);
  console.log(typeof crs_id);
  console.log(typeof dept_id);
  let first_name_checked = typeof first_name === 'string' ? first_name : null;
  let last_name_checked = typeof last_name === 'string' ? last_name : null;
  let email_checked = typeof email === 'string' ? email : null;
  let password_checked = typeof password === 'string' ? password : null;
  let phone_number_checked =
    typeof phone_number === 'string' ? phone_number : null;
  let salary_checked =
    typeof Number.parseInt(salary) === 'number' ? salary : null;
  let crs_id_checked =
    typeof Number.parseInt(crs_id) === 'number' ? crs_id : null;
  let dept_id_checked =
    typeof Number.parseInt(dept_id) === 'number' ? dept_id : null;

  if (
    email_checked === null ||
    first_name_checked === null ||
    last_name_checked === null ||
    password_checked === null ||
    phone_number_checked === null ||
    salary_checked === null ||
    crs_id_checked === null ||
    dept_id_checked === null
  ) {
    throw `ERROR WITH DEPT_NAME PARAM TYPE`;
  } else {
    return new Promise(async (resolve, reject) => {
      if (MSSQLConnection.pool.connected) {
        try {
          await createInsertInstructorUserProc();
          //if created
          const records = await MSSQLConnection.pool
            .request()
            .input('first_name', first_name)
            .input('last_name', last_name)
            .input('email', email)
            .input('password', password)
            .input('phone_number', phone_number)
            .input('salary', salary)
            .input('crs_id', crs_id)
            .input('dept_id', dept_id)
            .execute(
              DBProcedureDictionary.insertInstructorUser,
              (err, records, returnValue) => {
                if (err) {
                  reject(`{
              error : ${err},
              object : dbPoolConnection,
              function:insertInstructorRecord
               }`);
                  return;
                }
                //else
                resolve(records.rowsAffected);
              }
            );
        } catch (err) {
          console.log(err);
          reject(`{
                error : ${err},
                object : dbPoolConnection,
                function:${DBProcedureDictionary.insertInstructorUser}
            }`);
        }
      } else {
        reject(`{
          error : 'mssql db is not connected ..',
          object : dbPoolConnection,
          function:${DBProcedureDictionary.insertInstructorUser}
      }`);
      }
    });
  }
};

module.exports.getAllInstructorsUserRecords = async function () {
  return new Promise(async (resolve, reject) => {
    if (MSSQLConnection.pool.connected) {
      try {
        await getAllInstructorsProc(); //create or alter proc

        //if all are ok
        await MSSQLConnection.pool
          .request()
          .execute(
            DBProcedureDictionary.getAllInstructorsProc,
            (err, records, retValue) => {
              if (err) {
                reject(`{
                success:false,
                error:${err}
              }`);
                return;
              }
              //else
              resolve(records.recordset);
            }
          );
      } catch (err) {
        console.log(err);
        reject(err);
      }
    } else {
      throw `db not connected .. function : getAllInstructorsUserRecords`;
    }
  });
};

module.exports.deleteInstructorRecord = async function (email, ins_id) {
  return new Promise(async (resolve, reject) => {
    try {
      await deleteInstructorProc(); //create the delete proc

      //if all are ok

      await MSSQLConnection.pool
        .request()
        .input('email', email)
        .input('ins_id', ins_id)
        .execute(
          DBProcedureDictionary.deleteInstructorDictionaryProc,
          (err, records, retValue) => {
            if (err) {
              reject(err);
              return;
            }
            //else
            resolve(records.rowsAffected);
          }
        );
      console.log(ins_id);
      console.log(ins_id);
    } catch (error) {
      reject(error);
    }
  });
};

//TODO param check for this too
/**
 *@description this function create a proc and then use it to get a instructor students using his id to get it
 * @param {string} ins_id
 * @returns {sql.IResult<any>recordset}
 */
module.exports.getInstructorStudents = async function (ins_id) {
  return new Promise(async (resolve, reject) => {
    if (MSSQLConnection.pool.connected) {
      //if connected then we need to go on and make the request
      try {
        await getInstructorStudentsProc(); // proc first

        //if the proc created ok ! ?
        //then we need to call this proc and give it the ins_id then move the response up to the api layer
        MSSQLConnection.pool
          .request()
          .input('ins_id', ins_id)
          .execute(
            DBProcedureDictionary.getInstructorStudentProc,
            (error, recordSets, returnValue) => {
              if (error) {
                reject(error);
                return;
              }
              //if all are ok
              resolve(recordSets.recordset);
            }
          );
      } catch (error) {
        console.log(error);
        reject(error);
      }
    } else {
      reject(
        new Error(`u must be connected to the db before making this query`)
      );
    }
  });
};
