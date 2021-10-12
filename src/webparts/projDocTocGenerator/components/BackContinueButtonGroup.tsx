import { DefaultButton, PrimaryButton, Stack } from '@fluentui/react'
import React, { ReactElement } from 'react'
import { stylesBackContinueButtonGroup } from './styles/stylesButton'

interface BackContinueButtonGroupProps {
    onClickBack: (args: any) => any
    onClickContinue: (args: any) => any
}

export default function BackContinueButtonGroup({ onClickBack, onClickContinue }: BackContinueButtonGroupProps): ReactElement {
    return (
        <>
            <Stack horizontal styles={stylesBackContinueButtonGroup}>
                <DefaultButton text="Назад" onClick={onClickBack} style={{ position: 'relative', width: '50%' }} />
                <PrimaryButton text="Продолжить" type='submit' onClick={onClickContinue} style={{ position: 'relative', width: '50%' }} />
            </Stack>
        </>
    )
}
