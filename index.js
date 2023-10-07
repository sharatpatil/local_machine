const express = require('express');
const sql = require('mssql');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;
const os = require('os');

const { exec } = require('child_process');
const { request } = require('http');

const nodemailer = require('nodemailer');
const fs = require('fs');

const emailTemplate = fs.readFileSync('mail_templates/device_created.html', 'utf-8');

// Parse JSON bodies
app.use(bodyParser.json());

app.get('/', (req, res)=>{
	res.status(200);
	res.send("Welcome to root URL of Server");
});



const config = {
    user: 'sa',
    password: 'sa123',
    server: 'SQCPACKSYSTEM\\SQLEXPRESS',
    database: 'test',
    options: {           
        encrypt: false
    }
};

sql.connect(config)
  .then(() => {
    console.log('Connected to the MSSQL database.')
  })
  .catch((err) => {
    console.error('Error:', err);
  });

  app.post('/devices', async (req, res) => {
    try {
      const deviceData = req.body;

      const {
        deviceName,
        deviceNumber1,
        deviceNumber2,
        deviceNumber3,
        deviceNumber4,
        parameterName1,
        parameterName2,
        parameterName3,
        parameterName4,
        parameterName5,
        parameterName6,
        parameterName7,
        parameterName8,
        parameterName9,
        parameterName10,
        parameter1,
        parameter2,
        parameter3,
        parameter4,
        parameter5,
        parameter6,
        parameter7,
        parameter8,
        parameter9,
        parameter10,
        UserId
      } = deviceData;

      // const device_id =  'DEV' + (Math.floor(Math.random() * 9000) + 1000).toString() 
      
      // Retrieve parameter limitations from the database
    const query1 = 'SELECT parameter_name, upper_limit, lower_limit FROM Config';
    const result1 = await sql.query(query1);
    const limitations = result1.recordset;

    
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sqcpack.co.in@gmail.com',
    pass: 'sxiyujgfvijcwdrv'
  }
});


    
    limitations.forEach((limit) => {
      const paramName = limit.parameter_name;
      const paramValue = deviceData[paramName];
      const upperLimit = limit.upper_limit;
      const lowerLimit = limit.lower_limit;

      if (paramValue < lowerLimit || paramValue > upperLimit) {
        console.log('Out of range',lowerLimit, deviceData[paramName], upperLimit)

        
        const emailBody = emailTemplate
          .replace('{{deviceNumber1}}', deviceNumber1 || '')
          .replace('{{deviceNumber2}}', deviceNumber2 || '')
          .replace('{{deviceNumber3}}', deviceNumber3 || '')
          .replace('{{deviceNumber4}}', deviceNumber4 || '')
          .replace('{{paramName}}', paramName || '')
          .replace('{{paramValue}}', paramValue || '');

        const mailOptions = {
          from: 'sqcpack.co.in@gmail.com',
          to: ['sharathkumarpatil06@gmail.com','support@sqcpack.co.in','nandapqsystems@gmail.com',' product@pqsi.co.in'],
          subject: 'Alert: Data Point Outside the Limits',
          html: emailBody
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

      }
    });

   

    // If validation passes, proceed with inserting data into the database
    const device_id =
      'DEV' + (Math.floor(Math.random() * 9000) + 1000).toString();
      
      const query = `INSERT INTO devices (device_id, device_name,device_number1, device_number2, device_number3, device_number4, parameter_name1, parameter_name2, parameter_name3, parameter_name4, parameter_name5, parameter_name6, parameter_name7,parameter_name8, parameter_name9, parameter_name10, parameter1, parameter2, parameter3, parameter4, parameter5, parameter6, parameter7, parameter8, parameter9, parameter10, user_id) 
                     VALUES ('${device_id}', '${deviceName}', '${deviceNumber1}', '${deviceNumber2}', '${deviceNumber3}', '${deviceNumber4}',  '${parameterName1}', '${parameterName2}', '${parameterName3}', '${parameterName4}', '${parameterName5}', '${parameterName6}', '${parameterName7}', '${parameterName8}', '${parameterName9}', '${parameterName10}', '${parameter1}', '${parameter2}', '${parameter3}', '${parameter4}', '${parameter5}', '${parameter6}', '${parameter7}', '${parameter8}', '${parameter9}', '${parameter10}', ${UserId})`;
  


    
      const result = await sql.query(query)
    //   console.log('Data inserted successfully:', result);
  
      // res.status(200).json({ message: 'Data inserted successfully' });
      res.json(deviceData)
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  

  // Execute the ipconfig command
  exec('ipconfig', (error, stdout) => {
    if (error) {
      console.error(`Error executing ipconfig: ${error}`);
      return;
    }
  
    // Output the ipconfig results
    console.log(stdout);
  });
  
app.listen(PORT, (error) =>{
	if(!error)
		console.log("Server is Successfully Running, and App is listening on port "+ PORT + os.hostname)
	else
		console.log("Error occurred, server can't start", error);
	}
);

