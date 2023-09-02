import { ExtensionContext, languages } from 'vscode';
import { ComponentPathProvider } from './providers/definitionProvider';


export function activate(context: ExtensionContext) {
	const definitions = new ComponentPathProvider;
	context.subscriptions.push(languages.registerDefinitionProvider('django-html', definitions));
}

export function deactivate() {}