import React, { FC, useState, useEffect } from 'react'
import { styled } from '@mui/system'
import ToDoItem, { IToDoItem, StatusEnum } from './ToDoItem'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'
import LinearProgress, {
    linearProgressClasses,
} from '@mui/material/LinearProgress'
import Filter from './Filter'
import ListMenu from './ListMenu'
import TextField from '@mui/material/TextField'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'
import DeleteIcon from '@mui/icons-material/Delete'
import { client } from '../App'
import CircularProgress from '@mui/material/CircularProgress'

export interface IToDoList {
    listId: number
    listTitle: string
    color: string
}

const StyledBox = styled(Box)`
    display: flex;
    align-items: end;
    justify-content: space-between;
`

const StyledLinearProgress = styled(LinearProgress)`
    background-color: #f0f0f0;
    .${linearProgressClasses.bar} {
        background-color: ${(props: { barColor: string }) => props.barColor};
    }
`

const StyledDiv = styled('div')`
    max-height: 350px;
    overflow-y: auto;
    ms-overflow-style: none;
    scrollbar-width: none;
    ::-webkit-scrollbar {
        display: none;
    }
`

export const StyledContainedButton = styled(Button)`
    background-color: ${(props: { backgroundColor: string }) =>
        props.backgroundColor};
    &:hover {
        background-color: ${(props: { backgroundColor: string }) =>
            props.backgroundColor};
    }
`
export const StyledOutlinedButton = styled(Button)`
    border-color: ${(props: { lineColor: string }) => props.lineColor};
    color: ${(props: { lineColor: string }) => props.lineColor};

    &:active {
        background-color: ${(props: { lineColor: string }) => props.lineColor}+
            '45';
    }

    &:hover {
        background-color: ${(props: { lineColor: string }) => props.lineColor}+
            '0f';
        border-color: ${(props: { lineColor: string }) => props.lineColor};
    }
`

const StyledDeleteIcon = styled(DeleteIcon)`
    fill: ${(props: { fillColor: string }) => props.fillColor};
`

const StyledTextField = styled(TextField)`
    margin-top: 8px;
    width: calc(100% - 16px);
`
const StyledDateTimePicker = styled(DateTimePicker)`
    margin-top: 8px;
    width: calc(100% - 16px);
`

const StyledCardActions = styled(CardActions)`
    margin-bottom: 16px;
    margin-right: 16px;
    margin-left: 16px;
    padding: 0;
    padding-right: 16px;
    padding-left: 16px;
    display: flex;
    justify-content: space-between;
`

const ToDoList: FC<IToDoList> = ({ listId, listTitle, color }): JSX.Element => {
    const [expandToDoList, setExpandToDoList] = useState<boolean>(false)
    const [addNewTask, setAddNewTask] = useState<boolean>(false)
    const [showFilter, setShowFilter] = useState<boolean>(false)
    const [showSearch, setShowSearch] = useState<boolean>(false)
    const [keyword, setKeyword] = useState<string>('')
    const [showList, setShowList] = useState<IToDoItem[]>([])
    const [list, setList] = useState<IToDoItem[]>([])
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [deadline, setDeadline] = useState<Dayjs>(dayjs())
    const [progress, setProgress] = useState<number>(0)
    const [itemsCount, setItemsCount] = useState<number>(0)
    const [isPosting, setIsPosting] = useState<boolean>(false)

    useEffect(() => {
        client.get(`/todoList/${listId}`).then(response => {
            const data = response.data.tasks.map(
                (item: {
                    id: any
                    title: any
                    description: any
                    deadline:
                        | string
                        | number
                        | Date
                        | dayjs.Dayjs
                        | null
                        | undefined
                    status: string
                }) => {
                    return {
                        id: Number(item.id),
                        title: item.title,
                        description: item.description,
                        deadline: dayjs(item.deadline),
                        status: item.status,
                    }
                }
            )
            setList(data)
            setShowList(data)
        })
    }, [])

    useEffect(() => {
        const doneItemsCount = list.filter(
            item => item.status == StatusEnum.Done
        ).length
        setItemsCount(list.length)
        setProgress((doneItemsCount / list.length) * 100)
        showList.sort((item1, item2) => item1.deadline.diff(item2.deadline))
    }, [list])

    const handleClickOnToDoList = (): void => {
        setExpandToDoList(!expandToDoList)
    }

    const handleClickOnNewTaskButton = (event: {
        stopPropagation: () => void
    }): void => {
        event.stopPropagation()
        setAddNewTask(true)
        setShowList(list)
        setShowFilter(false)
        setShowSearch(false)
    }

    const handleChangeTitle = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setTitle(event.target.value)
    }

    const handleChangeDescription = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setDescription(event.target.value)
    }

    const handleChangeDeadline = (data: any): void => {
        setDeadline(dayjs(data))
    }

    const handleChangeKeyword = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setKeyword(event.target.value)
        setShowList(
            list.filter(
                item =>
                    item.title
                        .toLowerCase()
                        .includes(event.target.value.toLowerCase()) ||
                    item.description
                        .toLowerCase()
                        .includes(event.target.value.toLowerCase())
            )
        )
    }

    const handleClickOnSubmitButton = (event: {
        stopPropagation: () => void
    }): void => {
        event.stopPropagation()
        setIsPosting(true)
        const newList = [
            ...list,
            {
                id: list.length == 0 ? 1 : list[list.length - 1].id + 1,
                title: title,
                description: description,
                deadline: deadline,
                status: StatusEnum.Active,
            },
        ]
        client
            .put(`/todoList/${listId}`, {
                tasks: newList,
            })
            .then(response => {
                if (response.status == 200) {
                    setList(newList)
                    setShowList(newList)
                    setIsPosting(false)
                }
                setAddNewTask(false)
                setExpandToDoList(true)
                setTitle('')
                setDescription('')
                setDeadline(dayjs())
            })
    }

    const handleClickOnDeleteButton = (event: {
        stopPropagation: () => void
    }): void => {
        event.stopPropagation()
        setAddNewTask(false)
        setExpandToDoList(true)
        setTitle('')
        setDescription('')
        setDeadline(dayjs())
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card
                variant="outlined"
                sx={{ position: 'relative' }}
                onClick={handleClickOnToDoList}
            >
                <CardContent sx={{ ml: 2, mb: 1 }}>
                    <div style={{ marginRight: '16px' }}>
                        <ListMenu
                            showFilter={showFilter}
                            setShowFilter={setShowFilter}
                            list={list}
                            setShowList={setShowList}
                            setExpandToDoList={setExpandToDoList}
                            showSearch={showSearch}
                            setShowSearch={setShowSearch}
                        />
                        <StyledBox>
                            <Typography variant="h4" component="span">
                                {listTitle}
                            </Typography>
                            <Typography variant="body1" component="span">
                                {itemsCount} task
                                {itemsCount != 1 && 's'}
                            </Typography>
                        </StyledBox>
                        <StyledLinearProgress
                            variant="determinate"
                            sx={{ mt: 1, mb: 2 }}
                            value={progress}
                            barColor={color}
                        />
                        {showSearch && (
                            <StyledTextField
                                sx={{ width: '100%' }}
                                id="outlined-basic"
                                label="Enter keyword to search"
                                variant="outlined"
                                value={keyword}
                                onChange={handleChangeKeyword}
                                onClick={event => event.stopPropagation()}
                            />
                        )}
                        {showFilter && (
                            <Filter
                                list={list}
                                setShowList={setShowList}
                                color={color}
                            />
                        )}
                    </div>
                    <StyledDiv>
                        {expandToDoList &&
                            !addNewTask &&
                            (showList.length == 0 ? (
                                <Typography
                                    variant="body1"
                                    component="div"
                                    sx={{ textAlign: 'center', mr: 2, mt: 2 }}
                                >
                                    There are no{' '}
                                    {(showFilter || showSearch) && 'such '}
                                    tasks
                                </Typography>
                            ) : (
                                showList.map(item => (
                                    <ToDoItem
                                        listId={listId}
                                        id={item.id}
                                        title={item.title}
                                        description={item.description}
                                        deadline={dayjs(item.deadline)}
                                        status={item.status}
                                        setList={setList}
                                        list={list}
                                        setShowList={setShowList}
                                        showList={showList}
                                    />
                                ))
                            ))}
                        {addNewTask && !isPosting && (
                            <Box component="form" noValidate autoComplete="off">
                                <StyledTextField
                                    id="outlined-basic"
                                    label="Title"
                                    variant="outlined"
                                    value={title}
                                    onChange={handleChangeTitle}
                                />
                                <StyledTextField
                                    id="outlined-multiline-flexible"
                                    label="Description"
                                    multiline
                                    maxRows={4}
                                    value={description}
                                    onChange={handleChangeDescription}
                                />
                                <StyledDateTimePicker
                                    label="Deadline"
                                    value={deadline}
                                    onChange={handleChangeDeadline}
                                    renderInput={params => (
                                        <TextField {...params} />
                                    )}
                                />
                            </Box>
                        )}
                        {addNewTask && isPosting && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <CircularProgress color="inherit" />
                            </Box>
                        )}
                    </StyledDiv>
                </CardContent>
                {expandToDoList && !addNewTask && (
                    <StyledCardActions sx={{ justifyContent: 'flex-end' }}>
                        <StyledContainedButton
                            onClick={handleClickOnNewTaskButton}
                            variant="contained"
                            backgroundColor={color}
                        >
                            ADD NEW TASK
                        </StyledContainedButton>
                    </StyledCardActions>
                )}
                {addNewTask && !isPosting && (
                    <StyledCardActions>
                        <StyledOutlinedButton
                            variant="outlined"
                            startIcon={<StyledDeleteIcon fillColor={color} />}
                            onClick={handleClickOnDeleteButton}
                            lineColor={color}
                        >
                            Delete
                        </StyledOutlinedButton>
                        <StyledContainedButton
                            variant="contained"
                            onClick={handleClickOnSubmitButton}
                            backgroundColor={color}
                        >
                            Submit
                        </StyledContainedButton>
                    </StyledCardActions>
                )}
            </Card>
        </LocalizationProvider>
    )
}

export default ToDoList
