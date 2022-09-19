import Grid from '@mui/material/Grid'
import React, { FC, useEffect, useState } from 'react'
import ToDoList from './Components/ToDoList'
import axios from 'axios'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/system'
import AddIcon from '@mui/icons-material/Add'
import MyModal from './Components/MyModal'

export const client = axios.create({
    baseURL: 'https://632812529a053ff9aaaf917a.mockapi.io/todo',
})

const StyledTypography = styled(Typography)`
    margin: 32px;
`

const ContentGrid = styled(Grid)`
    background-color: #f0f0f0;
    height: 100%;
`

const MyAddIcon = styled(AddIcon)`
    height: 45px;
    width: 45px;
    border-radius: 50%;
    position: fixed;
    bottom: 10px;
    right: 10px;
    fill: white;
    background-color: black;
`
const colorPalette = [
    'tomato',
    'gold',
    'blueviolet',
    'limegreen',
    'orange',
    'royalblue',
]

const App: FC = (): JSX.Element => {
    const [data, setData] = useState<any[]>([])
    const [showModal, setShowModal] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [isPosting, setIsPosting] = useState<boolean>(false)

    useEffect(() => {
        client.get('/todoLists').then(response => {
            setData(response.data)
            console.log(response.data)
        })
    }, [])

    const handleClickOpenModal = () => {
        setShowModal(true)
    }

    const handleClickCloseModal = () => {
        setTitle('')
        setShowModal(false)
    }

    const handleChangeTitle = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setTitle(event.target.value)
    }

    const handleClickOnAdd = () => {
        setIsPosting(true)
        client
            .post('/todoLists', {
                listTitle: title,
            })
            .then(response => {
                setData([...data, response.data])
                handleClickCloseModal()
                setIsPosting(false)

                client
                    .post('/todoList', {
                        listTitle: title,
                        tasks: [],
                    })
                    .then(response => {})
            })
    }

    return (
        <Grid container>
            <Grid container></Grid>
            <ContentGrid container sx={{ m: 0 }}>
                <StyledTypography variant="h3">MY TODOs</StyledTypography>
                <Grid
                    container
                    sx={{ p: 3 }}
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 2, sm: 8, md: 12 }}
                >
                    {data.map(list => (
                        <Grid item xs={2} sm={4} md={4} key={list.id}>
                            <ToDoList
                                key={list.id}
                                listId={list.id}
                                listTitle={list.listTitle}
                                color={colorPalette[list.id % 5]}
                            />
                        </Grid>
                    ))}
                </Grid>
                {!showModal && <MyAddIcon onClick={handleClickOpenModal} />}
                <MyModal
                    showModal={showModal}
                    handleClickCloseModal={handleClickCloseModal}
                    isPosting={isPosting}
                    title={title}
                    handleChangeTitle={handleChangeTitle}
                    handleClickOnAdd={handleClickOnAdd}
                />
            </ContentGrid>
        </Grid>
    )
}

export default App
