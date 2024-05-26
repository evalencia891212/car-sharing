const pool = require('../db.js');
//const mysql = require('mysql2/promise');

const getEmployees =  async(req,res) => {
   const response = await pool.query('SELECT * FROM  `eco-cars`.employees');
   console.log(response.rows);
   res.json(response.rows);
};

const createEmployee = async(req,res) => {
    console.log(req.body);
    
    const {employee_number,name , last_name , mother_lastname, neighborhood, street , outdoor_number, interior_number,company_mail,personal_mail,location, active  } = req.body; 
    await pool.query('INSERT INTO public.employees(employee_number,"name", last_name, mother_lastname , neighborhood, street, outdoor_number, interior_number,company_mail, personal_mail ,"location", active) ' + 
                     'VALUES ?;',
                [employee_number,name , last_name , mother_lastname, neighborhood, street , outdoor_number, interior_number,company_mail, personal_mail ,location, active] );


    res.json({
        message:"Employee added succesfully",
        body: {
            employee:{name,last_name}
        }
    });
}

module.exports = {
    getEmployees,
    createEmployee

}