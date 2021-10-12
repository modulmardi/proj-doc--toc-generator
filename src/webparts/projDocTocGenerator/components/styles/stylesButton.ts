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
        right: '0',
        transform: 'translateX(150%)',
    }]
})
export const stylesAddButtonModalLateralLeft: IButtonStyles = mergeStyleSets(stylesOrdinaryButton, stylesCircleButton, stylesAddButtonModal, {
    root: [{
        left: '0',
        transform: 'translateX(-150%)',
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
export const stylesDeleteButton: IButtonStyles = mergeStyleSets(stylesCircleButton, {
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
export const stylesDeleteButtonModal: IButtonStyles = mergeStyleSets(stylesDeleteButton, {
    root: [{
        top: '0',
        left: '50%',
        transform: 'translate(-50%, -150%)'
    }]
})
