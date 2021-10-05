## Integration with Minio

### Steps for integration
1. Login using Fusionauth and get the JWT from that. Note - the User needs to have a registration to the Application `CDN` in fusionauth for this. 
2. Get the bucket temp crendentials using following API. Update `<<JWT Token>>` with the token you got from step 1; `<<Bucket Name>>` needs to be added prior and you can ask your admin to do this for you. `<<Token Duration>>` is in seconds - try to keep an upper limit by the limit of JWT.
  ```js
  var requestOptions = {
    method: 'POST',
    redirect: 'follow'
  };

  fetch("https://cdn.samagra.io/minio/<<Bucket Name>>/?Action=AssumeRoleWithWebIdentity&DurationSeconds=<<Token Duration>>&WebIdentityToken=<<JWT Token>>&Version=2011-06-15", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
  ```
3. You will get a respose similar to this from the above API call.
  ```XML
  <?xml version="1.0" encoding="UTF-8"?>
  <AssumeRoleWithWebIdentityResponse xmlns="https://sts.amazonaws.com/doc/2011-06-15/">
      <AssumeRoleWithWebIdentityResult>
          <AssumedRoleUser>
              <Arn></Arn>
              <AssumeRoleId></AssumeRoleId>
          </AssumedRoleUser>
          <Credentials>
              <AccessKeyId>Bla Bla Access Key</AccessKeyId>
              <SecretAccessKey>Bla Bla Secret Key</SecretAccessKey>
              <Expiration>2021-03-17T16:12:26Z</Expiration>
              <SessionToken>Bla Bla Session Token</SessionToken>
          </Credentials>
          <SubjectFromWebIdentityToken>11803383-f1a5-4b7f-ba4e-b2693f3aec33</SubjectFromWebIdentityToken>
      </AssumeRoleWithWebIdentityResult>
      <ResponseMetadata>
          <RequestId>166D2A31C74CB99A</RequestId>
      </ResponseMetadata>
  </AssumeRoleWithWebIdentityResponse>
  ```
4. Take the following elements out - `<AccessKeyId>` and `<SecretAccessKey>`. Now you can use the minio client like this.
  ```js
  var Minio = require('minio')

  var minioClient = new Minio.Client({
      endPoint: 'play.min.io',
      port: 9000,
      useSSL: true,
      accessKey: 'Q3AM3UQ867SPQQA43P2F',
      secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
      sessionToken: 'JWT Session Token'
  });
  ```

### Problems with this approach
1. The `<<Token Duration>>` needs to be really small to disallow misuse.
2. The `<AssumedRoleUser>` is currently not moderated and needs to be handled better either on the CDN front or on the frontend.

### Setting up the policy for minio
Assuming `e-samwad` is the bucket name and `esamwad` is the policy name

1. Create a file called `only-esamwad.json`
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
            "s3:*"
        ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::*e-samwad*"
      ],
      "Sid": "BucketAccessForUser"
    }
  ]
}
```

2. Add the policy to the minio using `mc` client

```sh
./mc admin policy add local2 esamwad policies/only-esamwad.txt
```

3. Add the same policy `esamwad` as part of the JWT token that you are creating. The parsed JWT will look something like this.
```json
{
  "accessKey": "N2LC01DVGB84AT8BM6V5",
  "applicationId": "2011a6c9-7fb7-4306-8c6d-c96cb07c7859",
  "aud": "2011a6c9-7fb7-4306-8c6d-c96cb07c7859",
  "authenticationType": "PASSWORD",
  "email": "abc@xyz.com",
  "email_verified": true,
  "exp": "1633434988",
  "iat": 1633431388,
  "iss": "acme.com",
  "jti": "5ad8265b-6cbb-4e7e-962a-39485786e272",
  "policy": "esamwad",
  "preferred_username": "chakshu",
  "roles": [],
  "sub": "be5ae034-cea9-415d-a476-81744aba644d"
}
```

### Starting the app
`node index.js`

## Annexure
[Minio Client to be used](https://docs.min.io/docs/javascript-client-api-reference.html)
