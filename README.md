![DynaLauncher](https://github.com/ThomasBoulestin/front-dynalauncher/blob/main/images/Terminals.png?raw=true)

![DynaLauncher](https://github.com/ThomasBoulestin/front-dynalauncher/blob/main/images/Tables.png?raw=true)

# Front - DynaLauncher

**Front - DynaLauncher** Is a project aiming to make Job management in LsDyna easy.
It is mainly inspired by LsRun (edited by Ansys LSTC)
But offer the capability of managing terminals directly in the GUI.
It communicate with an API running on the executive machine and can control it remotly.

**Front - DynaLauncher** is the client component of DynaLauncher. \
It's not meant to be used alone.

API here : [api - dynalauncher](https://github.com/ThomasBoulestin/api-dynalauncher "api - dynalauncher")

## Installation

### <u>Option 1:</u> Using released versions

Download **_.exe_** file from releases and execute it.

### <u>Option 2:</u> Run from sources files

Please ensure you have NPM installed and Node \

run `npm -i`

run `dev` script form **_package.json_**

### <u>Option 3:</u> Build from sources

run `build` script form **_package.json_**

## Regex Styling

Terminals can be customized using CSS and regex.
In the section **_settings / TerminalColorRules_**

The regex expression `^.*N\s+o\s+r\s+m\s+a\s+l\s+t\s+e\s+r\s+m\s+i\s+n\s+a\s+t\s+i\s+o\s+n.*$`\
will highlight lines containing
`N o r m a l    t e r m i n a t i o n` \
You can then add a css rule to style it

`color:#98c379;
font-weight: bold;
font-style: italic;
`

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
