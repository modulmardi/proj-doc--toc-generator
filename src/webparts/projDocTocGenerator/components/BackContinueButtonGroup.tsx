import { DefaultButton, PrimaryButton, Stack } from '@fluentui/react'
import React, { ReactElement } from 'react'

interface BackContinueButtonGroupProps {
    onClickBack: (args: any) => any
    onClickContinue: (args: any) => any
}

export default function BackContinueButtonGroup({ onClickBack, onClickContinue }: BackContinueButtonGroupProps): ReactElement {
    return (
        <>
            <Stack horizontal style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '1vh 0 0 0' }}>
                <DefaultButton text="Назад" onClick={onClickBack} style={{ width: '100%' }} />
                <PrimaryButton text="Продолжить" type='submit' onClick={onClickContinue} style={{ width: '100%' }} />
            </Stack>
        </>
    )
}
