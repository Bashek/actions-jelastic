const core = require('@actions/core');

const SYSTEM_APPID = "1dd8d191d38fff45e62564fcf67fdcd6";

const makeRequest = async (actionName, url, params) => {
    console.log(`Start ${actionName}`);

    const body = Object.keys(params)
        .reduce((bodyString, key) => {
            return bodyString + `${key}=${encodeURI(params[key])}&`
        }, "");

    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body
    }).then((response) => response.json())
        .then((result => {
            console.log(JSON.stringify(result, null, "  "));

            if (result.status !== 0) {
                throw Error(`actionName field. Status code = ${result.status}`);
            }

            return result;
        }));
}

const doAction = async ({
                            host,
                            password,
                            login,
                            envName,
                            tag,
                            nodeId
                        }) => {
    const { session } = await makeRequest(
        `https://${host}/1.0/users/authentication/rest/signin`, {
            appid: SYSTEM_APPID,
            password: password,
            login
        });

    await makeRequest(
        `https://${host}/1.0/environment/control/rest/redeploycontainers`,
        {
            session,
            envName,
            tag,
            nodeId
        });

    await makeRequest(
        `https://${host}/1.0/users/authentication/rest/signout`, {
            appid: SYSTEM_APPID,
            session
        });
}

try {
    doAction({
        host: core.getInput('host'),
        password: core.getInput('password'),
        login: core.getInput('login'),
        envName: core.getInput('env-name'),
        tag: core.getInput('tag'),
        nodeId: core.getInput('node-id')
    }).then()
        .catch(error => {
            core.setFailed(error.message);
        })
} catch (error) {
    core.setFailed(error.message);
}
