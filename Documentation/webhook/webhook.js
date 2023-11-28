const express = require('express');
const app = express();
const path = require('path');
const { exec } = require('child_process');

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/webhook', (req, res) => {
  const { ref } = req.body;
  let isMain;
  console.log(ref);
  if (ref === 'refs/heads/main') {
    isMain = true;
    console.log('Received push event for main branch');
  } else {
    isMain = false;
    console.log('Received push event for a different branch, ignoring it:', ref);
  }

  res.status(200).send('Webhook received.');

  if (isMain === true) {
    exec('cd ../Scheduler && git pull', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);

      exec('pm2 restart server', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error}`);
          return;
        }
        console.log(`Restarted API server`);
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        exec('cd ../Scheduler/web && npm install', (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error}`);
            return;
          }
          console.log(`Client dependencies installed.`);
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);

          exec('cd ../Scheduler/web && npm run build', (error, stdout, stderr) => {
            if (error) {
              console.error(`Error: ${error}`);
              return;
            }
            console.log(`Client build completed.`);
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);

            exec('cd ../Scheduler/API && npm install', (error, stdout, stderr) => {
              if (error) {
                console.error(`Error: ${error}`);
                return;
              }
              console.log(`API dependencies installed.`);
              console.log(`stdout: ${stdout}`);
              console.error(`stderr: ${stderr}`);

              exec('nginx -t', (error, stdout, stderr) => {
                if (error) {
                  console.error(`Error ${error}.`);
                  return;
                }
                console.log(`nginx test passed.`);
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);

                exec('systemctl restart nginx', (error, stdout, stderr) => {
                  if (error) {
                    console.error(`Error ${error}.`);
                    return;
                  }
                  console.log(`nginx server restarted.`);
                  console.log(`stdout: ${stdout}`);
                  console.error(`stderr: ${stderr}`);
                });
              });
            });
          });
        });
      });
    });
  }
});

app.listen(3000, () => {
  console.log(`Webhook server is running on port 3000`);
});
