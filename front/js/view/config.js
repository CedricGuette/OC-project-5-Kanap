
export async function loadConfig () {
    const result = await fetch('../config.json')
    return result.json
}

