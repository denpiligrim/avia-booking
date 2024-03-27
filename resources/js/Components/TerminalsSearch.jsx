import * as React from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { Autocomplete, Box, CircularProgress, FormControl, Grid, TextField, Typography, debounce } from '@mui/material';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import appState from '../store/appState';

const autocompleteService = { current: null };

const TerminalsSearch = observer(() => {

    const [store] = React.useState(appState);

    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const input = React.useRef(null);
    const [inpWidth, setInpWidth] = React.useState(0);
    const [inpLeft, setInpLeft] = React.useState(0);
    const [inpTop, setInpTop] = React.useState(0);

    const newWidth = () => {
        setTimeout(() => {
            const width = input.current.clientWidth;
            const left = input.current.getBoundingClientRect().left;
            const top = input.current.getBoundingClientRect().bottom + 2;
            setInpWidth(width);
            setInpLeft(left);
            setInpTop(top);
        }, 100);
    }

    const fetch = React.useMemo(
        () =>
            debounce((request, callback) => {
                setLoading(true);
                autocompleteService.current.get('/api/search?term=' + request.input)
                    .then(res => {
                        let json = res.data.result;
                        callback(json);
                        setLoading(false);
                    })
                    .catch(err => {
                    })
                    .finally(() => {
                    });
            }, 400),
        [],
    );

    React.useEffect(() => {
        let active = true;

        if (!autocompleteService.current) {
            autocompleteService.current =
                axios;
        }
        if (!autocompleteService.current) {
            return undefined;
        }

        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch({ input: inputValue }, (results) => {
            if (active) {
                let newOptions = [];

                if (value) {
                    newOptions = [value];
                }

                if (results) {
                    newOptions = [...newOptions, ...results];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    return (
        <Autocomplete
            id="search-catalog"
            sx={{
                width: '90%',
                maxWidth: 500,
                mx: 'auto',
                '& .MuiAutocomplete-popupIndicator': {
                    transform: 'none'
                }
            }}
            getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.name
            }
            filterOptions={(x) => x}
            slotProps={{
                popper: {
                    sx: {
                        width: inpWidth + "px !important",
                        transition: 'width 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                        transform: `translate(${inpLeft}px, ${inpTop}px) !important`
                    }
                }
            }}
            onOpen={newWidth}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            noOptionsText="Нет результатов"
            popupIcon={loading ? <CircularProgress color="primary" size={20} /> : <AirplanemodeActiveIcon sx={{ color: 'primary.main', transform: 'none' }} />}
            onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
                store.changeIata(newValue.iata);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <FormControl sx={{ mr: 1, maxWidth: { xs: '100%', md: '500px' }, width: '100%' }} variant="outlined">
                    <TextField
                        {...params}
                        id="search-box"
                        sx={{
                            background: 'white',
                            width: {
                                xs: '100%',
                                sm: '100%'
                            },
                            height: 48,
                            borderRadius: '4px',
                            transition: 'width 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                            "&:focus-within": {
                                width: '100%',
                                transition: 'width 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                height: '54px'
                            }
                        }}
                        placeholder='Город, аэропорт или терминал...'
                        ref={input}
                    />
                </FormControl>
            )}
            renderOption={(props, option) => {
                const matches = match(option.name, inputValue);

                const parts = parse(
                    option.name,
                    matches
                );

                return (
                    <li {...props}>
                        <Grid container alignItems="center">
                            <Grid item sx={{ display: 'flex', width: 60, pr: 1 }}>
                                <Typography variant="button" color="primary.main">
                                    {option.iata}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ width: 'calc(100% - 60px)', wordWrap: 'break-word' }}>
                                {parts.map((part, index) => (
                                    <Box
                                        key={index}
                                        component="span"
                                        sx={{ fontWeight: part.highlight ? 'bold' : 'regular', color: '#212529' }}
                                    >
                                        {part.text}
                                    </Box>
                                ))}
                                <Typography variant="body2" color="text.secondary">
                                    {option.label}
                                </Typography>
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
        />
    );
});
export default TerminalsSearch;