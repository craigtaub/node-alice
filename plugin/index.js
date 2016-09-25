 module.exports = function ({ types: t }) {
//export default function ({types: t}) {
	console.log('plugin');
	return {
		visitor: {
			FunctionDeclaration(path) {
        console.log('path')
				// path.insertBefore(t.expressionStatement(t.stringLiteral("console.log('hello')")));
				// console.log('state');
			},
			ReturnStatement(path) {
				console.log('path');
			},
			CallExpression: function(path, file) {
				console.log('path');
			},
			Identifier(path) {
			    console.log("Visiting: " + path);
			 }
            // FunctionDeclaration(path) {
            //     path.insertBefore(t.expressionStatement(t.stringLiteral("console.log('hello')")));
            //     //   path.insertAfter(t.expressionStatement(t.stringLiteral("A little high, little low.")));
            // },
        }
	};
};
