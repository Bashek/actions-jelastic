It uses Jelastic API to redeploy container with certain image tag.

Actually action calls consecutively folowing APIs
- https://docs.jelastic.com/api/#!/api/users.Authentication-method-Signin
- https://docs.jelastic.com/api/#!/api/environment.Control-method-RedeployContainers
- https://docs.jelastic.com/api/#!/api/users.Authentication-method-Signout

## Example
```yml
- name: 'Redeploy build'
  uses: Bashek/jelastic-redeploy-action@v1
  with:
    login: ${{ secrets.JELASTIC_LOGIN }}
    password: ${{ secrets.JELASTIC_PASS }}
    host: 'app.mircloud.host'
    env-name: 'target-env'
    tag: 'latest'
    node-id: '20154'
```
## Action Inputs

<table>
  <thead>
    <tr>
      <th>Input</th>
      <th>Required</th>
      <th>Description</th>
    </tr>
  </thead>

  <tr>
    <td>host</td>
    <td>Yes</td>
    <td>
      In most cases its jelastic dashboard host (like app.platform.com)
    </td>
  </tr>
  <tr>
    <td>login</td>
    <td>Yes</td>
    <td>
      Login of jelastic account
    </td>
  </tr>

  <tr>
    <td>password</td>
     <td>Yes</td>
    <td>Password of Jelastic account</td>
  </tr>

  <tr>
    <td>env-name</td>
    <td>Yes</td>
    <td>Environment name from jelastic dashboard</td>
  </tr>

  <tr>
    <td>tag</td>
    <td>Yes</td>
    <td>Target docker image tag</td>
  </tr>

  <tr>
    <td>node-id</td>
    <td>Yes</td>
    <td>target NodeId</td>
  </tr>

</table>

