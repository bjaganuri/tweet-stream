import fs from 'fs-extra';
import path from 'path';

let config = null;

const getEnvConfig = () => {
    const envConfigFolderPath = path.resolve('config', 'env');
    const env = process.env.NODE_ENV.trim() || 'production';
    let configPath = path.join(envConfigFolderPath, env);

    if (fs.existsSync(configPath)) {
        config = Array.from(fs.readdirSync(configPath)).reduce((a, p) => {
            return Object.assign(a, JSON.parse(fs.readFileSync(path.join(configPath, p), 'utf8')));
        }, {});
    } else {
        config = {};
    }
    return config;
};

export const envConfig = () => {
    if(!config || Object.keys(config) === 0) {
        config = getEnvConfig();
    }
    
    return config;
}