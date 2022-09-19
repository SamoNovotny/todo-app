import React, { FC, useState } from 'react'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import { IToDoItem } from './ToDoItem'
import { StatusEnum } from './ToDoItem'
import { styled } from '@mui/system'

const StyledChip = styled(Chip)`
    background-color: ${(props: { backgroundColor: any }) =>
        props.backgroundColor};
    &:hover {
        background-color: ${(props: { backgroundColor: string }) =>
            props.backgroundColor};
    }
`

interface Props {
    list: IToDoItem[]
    setShowList: React.Dispatch<React.SetStateAction<IToDoItem[]>>
    color: string
}

const Filter: FC<Props> = ({ list, setShowList, color }): JSX.Element => {
    const [
        filterConfiguration,
        setFilterConfiguration,
    ] = useState<StatusEnum | null>(null)

    const handleClickOnChip = (
        event: { stopPropagation: () => void },
        configuration: StatusEnum | null
    ) => {
        event.stopPropagation()
        setFilterConfiguration(configuration)
        if (configuration == null) {
            setShowList(list)
        } else {
            setShowList(list.filter(item => item.status == configuration))
        }
    }

    return (
        <Box sx={{ mt: 2, mb: 2 }}>
            <Typography gutterBottom variant="body1">
                Select type
            </Typography>
            <Stack direction="row" spacing={1}>
                <StyledChip
                    label="All"
                    backgroundColor={
                        filterConfiguration == null ? color : 'default'
                    }
                    onClick={event => handleClickOnChip(event, null)}
                />
                <StyledChip
                    label="Active"
                    backgroundColor={
                        filterConfiguration == StatusEnum.Active
                            ? color
                            : 'default'
                    }
                    onClick={event =>
                        handleClickOnChip(event, StatusEnum.Active)
                    }
                />
                <StyledChip
                    label="Done"
                    backgroundColor={
                        filterConfiguration == StatusEnum.Done
                            ? color
                            : 'default'
                    }
                    onClick={event => handleClickOnChip(event, StatusEnum.Done)}
                />
            </Stack>
        </Box>
    )
}

export default Filter
