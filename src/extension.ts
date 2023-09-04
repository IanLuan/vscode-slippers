import { ExtensionContext, languages } from 'vscode';
import { ComponentDefinitionProvider } from './providers/definitionProvider';


export function activate(context: ExtensionContext) {
	const definitions = new ComponentDefinitionProvider;
	context.subscriptions.push(languages.registerDefinitionProvider('django-html', definitions));
}

export function deactivate() {}