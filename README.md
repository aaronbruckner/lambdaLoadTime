#AWS Lambda Load Time Tester

This is a simple node project used to test initialization time of AWS Lambda functions. This project helped me determine
how large a function could be before significantly impacting performance. Large initialization times will lead to
poor user experiences as random requests take longer to complete. Results from my personal testing can be found at 
http://aaronbruckner.com/article_awsLambda.html. 

#To Run

There are a few things you must do to run this script:

1. Install the AWS-CLI and configure it with your credentials (`aws configure`).
2. From the root folder, run install.sh. This will go to every function folder, install required npm modules,
and create a zip for a Lambda upload. After this, a zip file will exist for each function type within 
/functions (/small/small.zip, /medium/medium.zip, etc).
3. The test script expects each of the function zips to be uploaded to an S3 bucket you own. Take each of the zip files 
located in /functions/<functionType>/<functionType>.zip and upload them to your S3 bucket. Within the S3 bucket, you 
must place them at /functions/<functionType>.zip (/functions/small.zip).
4. Update the configuration at the top of lambdaLoadTime.js. S3Bucket should be the key to your bucket. LambdaRoleARN 
must be an AWS ARN for an IAM role with Lambda execution privileges. This is the access granted to the lambda function
so it at least needs to be able to execute itself!
5. Execute `node lambdaLoadTime.js`. This will start a series of Lambda tests for micro, small, medium, large, extraLarge,
huge, and insane function types. Results will be printed to the console. Functions are executed synchronously to avoid
performance blocks besides AWS.
