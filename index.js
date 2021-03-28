const core = require('@actions/core');
const fetch = require('node-fetch');
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

            if (result.result !== 0) {
                throw Error(`${actionName} field. Status code = ${result.status}`);
            }

            return result;
        }));
}

const doAction = async ({
                            action,
                            host,
                            password,
                            login,
                            envName,
                            tag,
                            nodeId,
                            fileUrl
                        }) => {
    const actionName = action.toLocaleLowerCase();
    const { session } = await makeRequest(
        "Signin",
        `https://${host}/1.0/users/authentication/rest/signin`, {
            appid: SYSTEM_APPID,
            password,
            login
        });

    if (actionName === "redeploy") {
        await makeRequest(
            "Redeploy",
            `https://${host}/1.0/environment/control/rest/redeploycontainers`,
            {
                session,
                envName,
                tag,
                nodeId
            });
    }

    if (actionName === "deployarchive") {
        await makeRequest(
            "Deploy Archive",
            `https://${host}/1.0/environment/deployment/rest/deployarchive`,
            {
                session,
                envName,
                nodeId,
                fileUrl
            });
    }

    await makeRequest(
        "Signout",
        `https://${host}/1.0/users/authentication/rest/signout`, {
            appid: SYSTEM_APPID,
            session
        });
}

try {
    doAction({
        action: core.getInput('action'),
        fileUrl: core.getInput('fileUrl'),
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
