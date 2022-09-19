import React, { FC, useState } from 'react'
import { styled } from '@mui/system'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { IToDoItem } from './ToDoItem'
import TextField from '@mui/material/TextField'

const iconSize = 35

const iconStyle = `
    width: ${iconSize}px;
    height: ${iconSize}px;
    background-color: #f0f0f0;
    border-radius: 50%;
    margin-left: 5px;
`

const MenuIcon = styled(MoreHorizOutlinedIcon)`
    ${iconStyle}
    position: relative;
    &.left-rotation {
        animation-name: left-spin;
        animation-duration: 500ms;

        @keyframes left-spin {
            0% {
                transform: translate(0, 0) rotate(0deg);
            }
            100% {
                transform: translate(-${iconSize * 3.14}px, 0) rotate(-360deg);
            }
        }
    }

    &.right-rotation {
        animation-name: right-spin;
        animation-duration: 500ms;

        @keyframes right-spin {
            0% {
                transform: translate(-${iconSize * 3.14}px, 0) rotate(-360deg);
            }
            100% {
                transform: translate(0, 0) rotate(0deg);
            }
        }
    }

    &.expanded {
        transform: translate(-${iconSize * 3.14}px, 0);
    }
`

const FilterIcon = styled(FilterAltOutlinedIcon)`
    ${iconStyle}
    transform: translate(${iconSize + 5}px, 0);
`

const ActiveFilterIcon = styled(FilterAltIcon)`
    ${iconStyle}
    transform: translate(${iconSize + 5}px, 0);
`

const MySearchIcon = styled(SearchIcon)`
    ${iconStyle}
    position: relative;
    transform: translate(${2 * iconSize + 10 - (iconSize * 3.14) / 2}px, 0);
`

interface Props {
    showFilter: boolean
    setShowFilter: React.Dispatch<React.SetStateAction<boolean>>
    list: IToDoItem[]
    setShowList: React.Dispatch<React.SetStateAction<IToDoItem[]>>
    setExpandToDoList: React.Dispatch<React.SetStateAction<boolean>>
    showSearch: boolean
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}

const ListMenu: FC<Props> = ({
    showFilter,
    setShowFilter,
    list,
    setShowList,
    setExpandToDoList,
    showSearch,
    setShowSearch,
}): JSX.Element => {
    const [expandMenu, setExpandMenu] = useState<boolean>(false)
    const [isRotating, setIsRotating] = useState<boolean>(false)

    const handleClickOnMenuIcon = (event: {
        stopPropagation: () => void
    }): void => {
        event.stopPropagation()
        setIsRotating(true)
        setTimeout(() => {
            setIsRotating(false)
            setExpandMenu(!expandMenu)
        }, 500)
    }

    const handleClickOnFilterIcon = (event: {
        stopPropagation: () => void
    }): void => {
        event.stopPropagation()
        if (!showFilter) {
            setShowSearch(false)
        }
        setShowList(list)
        setShowFilter(!showFilter)
        setExpandToDoList(true)
    }

    const handleClickOnMySearchIcon = (event: {
        stopPropagation: () => void
    }): void => {
        event.stopPropagation()
        if (!showSearch) {
            setShowFilter(false)
        }
        setShowList(list)
        setShowSearch(!showSearch)
        setExpandToDoList(true)
    }

    return (
        <div
            style={{
                width: '100%',
                justifyContent: 'flex-end',
                display: 'flex',
                marginBottom: '16px',
            }}
        >
            {expandMenu && (
                <>
                    <MySearchIcon onClick={handleClickOnMySearchIcon} />
                    {!showFilter ? (
                        <FilterIcon onClick={handleClickOnFilterIcon} />
                    ) : (
                        <ActiveFilterIcon onClick={handleClickOnFilterIcon} />
                    )}
                </>
            )}
            <MenuIcon
                onClick={handleClickOnMenuIcon}
                className={
                    isRotating && !expandMenu
                        ? 'left-rotation'
                        : isRotating
                        ? 'right-rotation'
                        : expandMenu
                        ? 'expanded'
                        : undefined
                }
            />
        </div>
    )
}

export default ListMenu
