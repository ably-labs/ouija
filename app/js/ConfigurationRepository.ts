import { Configuration } from "./types";

export type DefaultValueCreator = () => Configuration;

export class ConfigurationRepository {

    public load(orDefault: DefaultValueCreator | null = null): Configuration {
        let settingsText = localStorage.getItem('Configuration');

        if (!settingsText || settingsText === "null" || settingsText === null) {
            if (!orDefault) {
                return null;
            }

            const defaults = orDefault();
            this.save(orDefault());
            return defaults;
        }

        return <Configuration>JSON.parse(settingsText);
    }

    public save(config: Configuration) {
        let settingsText = JSON.stringify(config);
        localStorage.setItem("Configuration", settingsText);
    }
}