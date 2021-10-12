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
export const stylesAddButtonModalLateralLeft: IButtonStyles = mergeStyleSets(stylesOrdinaryButton, stylesCircleButton, stylesAddButtonModal, {
    root: [{
        left: '-1vw',
        transform: 'translateX(-100%)'

    }]
})
export const stylesAddButtonModalLateralRight: IButtonStyles = mergeStyleSets(stylesOrdinaryButton, stylesCircleButton, stylesAddButtonModal, {
    root: [{
        right: '-1vw',
        transform: 'translateX(100%)'
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

export const stylesButtonLateral: IButtonStyles = {
    root: {
        position: 'absolute',
        left: '-0.5vw',
        transform: 'translateX(-100%)'
    }
}

export const stylesEditButtonLateral: IButtonStyles = mergeStyleSets(stylesOrdinaryButton, stylesCircleButton, stylesButtonLateral, {
    root: [{
        top: '20%',
    }]
})
export const stylesDeleteButton: IButtonStyles = mergeStyleSets(stylesCircleButton, {
    root: [{
        background: theme.palette.white,
        color: theme.palette.red,
    }],
    rootHovered: [{
        background: theme.palette.red,
        color: theme.palette.white
    }],
})
export const stylesDeleteButtonLateral: IButtonStyles = mergeStyleSets(stylesDeleteButton, stylesButtonLateral, {
    root: [{
        top: '80%',
    }],
})
export const stylesDeleteButtonModal: IButtonStyles = mergeStyleSets(stylesDeleteButton, {
    root: [{
        position: 'absolute',
        top: '-1vh',
        left: '50%',

        transform: 'translate(-50%, -100%)',
        zIndex: '10'
    }]
})
