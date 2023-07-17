import inquirer from 'inquirer';
import 'colors';

export const menu = async() => {
    const opciones = [
        {
            type: 'list',
            name: 'opcion',
            message: 'Select an option',
            choices: [
                {
                    value: '1',
                    name:`${'1.'.green} Upload a bill` 
                },
                {
                    value: '0',
                    name:`${'0.'.green} Exit` 
                }
            ]
        }
    ];

    const { opcion } = await inquirer.prompt(opciones);
    return opcion;
}

export const header = () => {
    console.clear();

    console.log('==============================='.green);
    console.log(' P A Y M E N T  M A N A G E R'.green);
    console.log('===============================\n'.green);
}

export const readInput = async (message) => {
    const { value } = await inquirer.prompt([{
        type: "input",
        name: "value",
        message,
        validate(value) {
            if (value.length === 0) return 'Enter a value';
            return true;
        }
    }]);

    return value;
}
