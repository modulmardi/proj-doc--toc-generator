import { createTheme, IButtonStyles, ITheme, mergeStyleSets } from "@fluentui/react";

const ThemeColorsFromWindow: any = (window as any).__themeState__.theme;
const theme: ITheme = createTheme({ //pass this object to your components
    palette: ThemeColorsFromWindow
});
export const stylesCircleButton: IButtonStyles = {
    root: [{
        borderRadius: '50%'
    }],
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

export const stylesAddButtonModal: IButtonStyles = mergeStyleSets(stylesOrdinaryButton, stylesCircleButton, {
    root: [{
        position: 'absolute',
        zIndex: '10',
        top: '50%',
        borderRadius: '50%',
    }]
})
export const stylesAddButtonModalLateralRight: IButtonStyles = mergeStyleSets(stylesOrdinaryButton, stylesCircleButton, stylesAddButtonModal, {
    root: [{
        right: '20vw',
    }]
})
export const stylesAddButtonModalLateralLeft: IButtonStyles = mergeStyleSets(stylesOrdinaryButton, stylesCircleButton, stylesAddButtonModal, {
    root: [{
        left: '20vw',
    }]
})
export const stylesAddButtonModalCentral: IButtonStyles = mergeStyleSets(stylesOrdinaryButton, stylesCircleButton, stylesAddButtonModal, {
    root: [{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '10vh',
        height: '10vh',
        border: '1px solid ' + theme.palette.themeDark

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
    }],
    rootHovered: [{
        background: theme.palette.red,
        color: theme.palette.white
    }],
})
export const stylesCancelButtonLateral: IButtonStyles = mergeStyleSets(stylesCancelButton, {
    root: [{
        position: 'absolute',
        left: '0',
        top: '80%',
        transform: 'translate(-110%, -100%)'
    }],
})
export const stylesCancelButtonModal: IButtonStyles = mergeStyleSets(stylesCancelButton, {
    root: [{
        position: 'absolute',
        top: '3%',
        left: '50%',
        
        transform: 'translate(-50%, -50%)',
        zIndex:'10'
    }]
})
