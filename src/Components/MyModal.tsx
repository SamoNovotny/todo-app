import React, { FC } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import { StyledContainedButton, StyledOutlinedButton } from './ToDoList'

interface Props {
    showModal: boolean
    handleClickCloseModal: () => void
    isPosting: boolean
    title: string
    handleChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleClickOnAdd: () => void
}

const MyModal: FC<Props> = ({
    showModal,
    handleClickCloseModal,
    isPosting,
    title,
    handleChangeTitle,
    handleClickOnAdd,
}): JSX.Element => {
    return (
        <Dialog open={showModal} onClose={handleClickCloseModal}>
            <DialogTitle id="responsive-dialog-title">
                {isPosting ? 'Adding ' : 'Add '}new TODO List
            </DialogTitle>
            {isPosting ? (
                <DialogContent
                    sx={{ display: 'flex', justifyContent: 'center' }}
                >
                    <CircularProgress color="inherit" />
                </DialogContent>
            ) : (
                <>
                    <DialogContent>
                        <TextField
                            id="outlined-basic"
                            sx={{ mt: 2 }}
                            label="Title"
                            variant="outlined"
                            value={title}
                            onChange={handleChangeTitle}
                        />
                    </DialogContent>
                    <DialogActions>
                        <StyledOutlinedButton
                            variant="outlined"
                            lineColor="black"
                            onClick={handleClickCloseModal}
                        >
                            Delete
                        </StyledOutlinedButton>
                        <StyledContainedButton
                            variant="contained"
                            backgroundColor="black"
                            onClick={handleClickOnAdd}
                        >
                            Add
                        </StyledContainedButton>
                    </DialogActions>
                </>
            )}
        </Dialog>
    )
}

export default MyModal
