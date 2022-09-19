import React, { FC, useState } from 'react'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import { styled } from '@mui/system'
import { Dayjs } from 'dayjs'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { client } from '../App'
import CircularProgress from '@mui/material/CircularProgress'

export enum StatusEnum {
    Active,
    Done,
}

export interface IToDoItem {
    id: number
    title: string
    description: string
    deadline: Dayjs
    status: StatusEnum
}

export interface Props {
    listId: number
    id: number
    title: string
    description: string
    deadline: Dayjs
    status: StatusEnum
    setList: React.Dispatch<React.SetStateAction<IToDoItem[]>>
    list: IToDoItem[]
    setShowList: React.Dispatch<React.SetStateAction<IToDoItem[]>>
    showList: IToDoItem[]
}

const iconStyle = `
    position: absolute;
    top: calc(50% - 20px);
    right: -20px;
    width: 40px;
    height: 40px;
    background-color: white;
`

const DoneIcon = styled(TaskAltRoundedIcon)`
    ${iconStyle}
    fill: #20bd04;
`
const InProgressIcon = styled(AccessTimeOutlinedIcon)`
    ${iconStyle}
    fill: #fcdb0b;
`
const LoaderIcon = styled(CircularProgress)`
    position: absolute;
    top: calc(50% - 17px);
    right: -17px;
    background-color: white;
    fill: red;
`

const ToDoItem: FC<Props> = ({
    listId,
    id,
    title,
    description,
    deadline,
    status,
    setList,
    list,
    setShowList,
    showList,
}): JSX.Element => {
    const [myStatus, setMyStatus] = useState<StatusEnum>(status)
    const [isPosting, setIsPosting] = useState<boolean>(false)

    const handleClickOnToDoItem = (event: {
        stopPropagation: () => void
    }): void => {
        event.stopPropagation()
        setIsPosting(true)
        const newList = list.filter(item => item.id != id)
        const update = {
            id: id,
            title: title,
            deadline: deadline,
            description: description,
            status:
                myStatus == StatusEnum.Active
                    ? StatusEnum.Done
                    : StatusEnum.Active,
        }
        console.log(newList)
        client
            .put(`/todoList/${listId}`, {
                tasks: [...newList, update],
            })
            .then(response => {
                setIsPosting(false)
                if (response.status == 200) {
                    setMyStatus(
                        myStatus == StatusEnum.Active
                            ? StatusEnum.Done
                            : StatusEnum.Active
                    )
                    setList([...newList, update])
                }
            })
    }

    const handleClickOnDeleteIcon = (event: {
        stopPropagation: () => void
    }): void => {
        event.stopPropagation()
        const newList = list.filter(item => item.id != id)
        console.log(newList)
        client
            .put(`/todoList/${listId}`, {
                tasks: newList,
            })
            .then(response => {
                console.log(response)
                if (response.status == 200) {
                    setList(newList)
                    setShowList(showList.filter(item => item.id != id))
                }
            })
    }

    return (
        <Card
            variant="outlined"
            sx={{
                overflow: 'visible',
                position: 'relative',
                width: 'calc(100% - 20px)',
            }}
            onClick={handleClickOnToDoItem}
        >
            <CardContent>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="h6" component="span">
                        {title}
                    </Typography>
                    <DeleteOutlineIcon onClick={handleClickOnDeleteIcon} />
                </div>
                <Typography
                    sx={{ mb: 1.5 }}
                    color="text.secondary"
                    component="div"
                >
                    {deadline.toDate().toLocaleString()}
                </Typography>
                <Typography variant="body2" component="div">
                    {description}
                </Typography>
                {isPosting ? (
                    <LoaderIcon
                        size={34}
                        style={{
                            color:
                                myStatus == StatusEnum.Done
                                    ? '#20bd04'
                                    : '#fcdb0b',
                        }}
                    />
                ) : myStatus == StatusEnum.Done ? (
                    <DoneIcon />
                ) : (
                    <InProgressIcon />
                )}
            </CardContent>
        </Card>
    )
}

export default ToDoItem
