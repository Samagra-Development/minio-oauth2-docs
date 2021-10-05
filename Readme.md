### PoC for Minio Client
[Doc](https://gist.github.com/ChakshuGautam/9b9daa4fcb10fe9336521a3d9efb9a45)

This doc just has the last step.

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