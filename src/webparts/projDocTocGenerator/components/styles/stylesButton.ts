import { createTheme, IButtonStyles, ITheme, mergeStyleSets } from "@fluentui/react";

const ThemeColorsFromWindow: any = (window as any).__themeState__.theme;
const theme: ITheme = createTheme({ //pass this object to your components
    palette: ThemeColorsFromWindow
});
export const stylesCircleButton: IButtonStyles = {
    root: [{
        borderRadius: '50%'
    }]
}
export const stylesOrdinaryButton: IButtonStyles = {
    root: [{
        background: theme.palette.white,
        color: theme.palette.themePrimary
    }],
    rootHovered: [{
        backgroundColor: theme.palette.themePrimary,
        color: theme.palette.white
    }],
};
export const stylesAddButtonBig: IButtonStyles = mergeStyleSets(stylesOrdinaryButton, {
    root: [{
        width: '100%',
    }]
})
export const stylesAddButtonLateral: IButtonStyles = mergeStyleSets(stylesOrdinaryButton, stylesCircleButton, {
    root: [{
        position: 'absolute',
        right: '0',
        top: 0,
        transform: 'translate(110%, -50%)',
        zIndex: '10',
        borderRadius: '50%',
    }]
})
export const stylesEditButton: IButtonStyles = mergeStyleSets(stylesOrdinaryButton, stylesCircleButton, {
    root: [{
        position: 'absolute',
        left: '0',
        top: '20%',
        transform: 'translateX(-110%)'
    }]
})
export const stylesCancelButton: IButtonStyles = mergeStyleSets(stylesCircleButton, {
    root: [{
        background: theme.palette.white,
        color: theme.palette.red,
        position: 'absolute',
        left: '0',
        top: '80%',
        transform: 'translate(-110%, -100%)'
    }],
    rootHovered: [{
        background: theme.palette.red,
        color: theme.palette.white
    }],
})