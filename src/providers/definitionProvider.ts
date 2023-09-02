import {
    CancellationToken,
    Definition,
    DefinitionProvider,
    Location,
    Position,
    ProviderResult,
    TextDocument,
    Uri,
    workspace,
} from 'vscode'

import * as fs from 'fs';
import * as yaml from 'js-yaml';

let cache: any = {}

export class ComponentPathProvider implements DefinitionProvider {

    private async getComponentPathFromYaml(componentName: String): Promise<String|null> {
        const searchYaml = "**/templates/components.{yaml,yml}";
        const yamlPath = await workspace.findFiles(searchYaml, '', 1).then(results => {
            const result = results.length ? results[0] : null;
            return result;
        });

        if (yamlPath) {
            try {
                const fileContents = fs.readFileSync(yamlPath.fsPath, 'utf8');
                const yamlData: any = yaml.load(fileContents);
                const componentPath = yamlData.components[componentName as keyof typeof yamlData.components];
                return componentPath;
            } catch (error) {
                console.error(error);
            }
        }

        return null;
    }

    public provideDefinition(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Definition> {
        const line = document.lineAt(position.line).text;
        const componentMatch = line.match(/{%\s*[#/](\w+)\s*%}/);

        if (componentMatch) {
            const componentName = componentMatch[1];

            const componentLocation = this.getComponentPathFromYaml(componentName).then(async (componentPath) => {
                const componentUri = await workspace.findFiles(`**/templates/${componentPath}`, '', 1).then(results => {
                    const result = results.length ? results[0] : null;
                    return result;
                });

                if (componentUri) {
                    const componentPosition = new Position(0, 0);
                    if (fs.existsSync(componentUri.fsPath)) {
                        return new Location(componentUri, componentPosition);
                    }
                }
            })
            
            return componentLocation;
        }

        return null;
    }
}