import { useState, useMemo, useCallback } from "react";
import { Box, Typography, Pagination, Grid, PaginationItem, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Fade, Container } from "@mui/material";
import SimpleBar from "simplebar-react";
import Footer from "../utils/Footer";
import Vod from "./Vod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useVods } from "../hooks/useVods";
import { useDebounce } from "../hooks/useDebounce";
import { useResponsive } from "../hooks/useMediaQueries";
import { VodCardSkeleton } from "../components/LoadingSkeleton";

const FILTERS = ["Default", "Date", "Title", "Game"];
const START_DATE = process.env.REACT_APP_START_DATE;

export default function Vods() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const { isMobile } = useResponsive();
  
  const [filter, setFilter] = useState(FILTERS[0]);
  const [filterStartDate, setFilterStartDate] = useState(dayjs(START_DATE));
  const [filterEndDate, setFilterEndDate] = useState(dayjs());
  const [filterTitleInput, setFilterTitleInput] = useState("");
  const [filterGameInput, setFilterGameInput] = useState("");
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  
  const page = parseInt(query.get("page") || "1", 10);
  const limit = isMobile ? 10 : 20;

  // Debounce the filter inputs
  const debouncedTitle = useDebounce(filterTitleInput, 800);
  const debouncedGame = useDebounce(filterGameInput, 800);

  // Prepare filter options for the hook
  const filterOptions = useMemo(() => ({
    startDate: filterStartDate,
    endDate: filterEndDate,
    title: debouncedTitle,
    game: debouncedGame,
  }), [filterStartDate, filterEndDate, debouncedTitle, debouncedGame]);

  // Use the custom hook for fetching VODs
  const { vods, totalVods, loading } = useVods(filter, filterOptions, page, limit);

  const changeFilter = useCallback((evt) => {
    setFilter(evt.target.value);
    navigate(`${location.pathname}?page=1`);
  }, [navigate, location.pathname]);

  const handleSubmit = useCallback((e) => {
    const value = e.target.value;
    if (e.which === 13 && !isNaN(value) && value > 0) {
      navigate(`${location.pathname}?page=${value}`);
    }
  }, [navigate, location.pathname]);

  const handleTitleChange = useCallback((evt) => {
    setFilterTitleInput(evt.target.value);
  }, []);

  const handleGameChange = useCallback((evt) => {
    setFilterGameInput(evt.target.value);
  }, []);

  const handleTitleClick = useCallback(() => {
    const newCount = titleClickCount + 1;
    setTitleClickCount(newCount);
    if (newCount >= 5) {
      setShowEasterEgg(true);
      setTitleClickCount(0);
      // Auto-hide after animation completes
      setTimeout(() => {
        setShowEasterEgg(false);
      }, 3000);
    }
  }, [titleClickCount]);

  const totalPages = useMemo(() => 
    totalVods ? Math.ceil(totalVods / limit) : 0,
    [totalVods, limit]
  );

  return (
    <SimpleBar style={{ minHeight: 0, height: "100%" }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Fade in timeout={600}>
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            mb: 3,
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
          }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              {totalVods !== null && (
                <Typography 
                  variant="h3" 
                  onClick={handleTitleClick}
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                    background: (theme) => theme.palette.primary.gradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.02em",
                    mb: 0.5,
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "transform 0.1s ease",
                    position: "relative",
                    zIndex: 1,
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                  }}
                >
                  VOD Archive
                </Typography>
              )}
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                {totalVods !== null && `${totalVods.toLocaleString()} videos available`}
              </Typography>
            </Box>
          </Box>
        </Fade>
        
        <Box sx={{ 
          mb: 4,
          p: 3,
          borderRadius: 3,
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "rgba(255, 255, 255, 0.05)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}>
          <Box sx={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row", 
            alignItems: isMobile ? "stretch" : "center",
            gap: 2,
          }}>
            <FormControl sx={{ minWidth: { xs: "100%", sm: 180 } }}>
              <InputLabel id="filter-label">Filter By</InputLabel>
              <Select 
                labelId="filter-label" 
                label="Filter By" 
                value={filter} 
                onChange={changeFilter}
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(139, 92, 246, 0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(139, 92, 246, 0.5)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                }}
              >
                {FILTERS.map((data, i) => (
                  <MenuItem key={i} value={data}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {data === "Default" && "📋"}
                      {data === "Date" && "📅"}
                      {data === "Title" && "🔍"}
                      {data === "Game" && "🎮"}
                      <Typography>{data}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {filter === "Date" && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: "flex", gap: 2, flexDirection: isMobile ? "column" : "row", flex: 1 }}>
                  <DatePicker
                    minDate={dayjs(START_DATE)}
                    maxDate={dayjs()}
                    label="Start Date"
                    value={filterStartDate}
                    onChange={(newDate) => setFilterStartDate(newDate)}
                    views={["year", "month", "day"]}
                    slotProps={{
                      textField: { 
                        fullWidth: true,
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          }
                        }
                      }
                    }}
                  />
                  <DatePicker
                    minDate={dayjs(START_DATE)}
                    maxDate={dayjs()}
                    label="End Date"
                    value={filterEndDate}
                    onChange={(newDate) => setFilterEndDate(newDate)}
                    views={["year", "month", "day"]}
                    slotProps={{
                      textField: { 
                        fullWidth: true,
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </LocalizationProvider>
            )}
            
            {filter === "Title" && (
              <TextField 
                fullWidth 
                label="Search by Title" 
                type="text" 
                onChange={handleTitleChange} 
                value={filterTitleInput}
                placeholder="Type to search..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  }
                }}
              />
            )}
            
            {filter === "Game" && (
              <TextField 
                fullWidth 
                label="Search by Game" 
                type="text" 
                onChange={handleGameChange} 
                value={filterGameInput}
                placeholder="Type game name..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  }
                }}
              />
            )}
          </Box>
        </Box>
        
        {loading ? (
          <VodCardSkeleton count={limit} gridSize={2.4} />
        ) : vods && vods.length > 0 ? (
          <Fade in timeout={400}>
            <Grid 
              container 
              spacing={3}
            >
              {vods.map((vod, index) => (
                <Vod gridSize={2.4} key={vod.id} vod={vod} isMobile={isMobile} index={index} showEasterEgg={showEasterEgg} />
              ))}
            </Grid>
          </Fade>
        ) : (
          <Box sx={{ 
            textAlign: "center", 
            py: 12,
            px: 2,
          }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 2,
                fontWeight: 600,
                color: "text.secondary",
              }}
            >
              No VODs Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your filters or search terms
            </Typography>
          </Box>
        )}

        {totalPages > 0 && (
          <Box sx={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            py: 4,
            mt: 4,
          }}>
            <Pagination
              shape="rounded"
              count={totalPages}
              disabled={totalPages <= 1}
              color="primary"
              page={page}
              size={isMobile ? "medium" : "large"}
              renderItem={(item) => (
                <PaginationItem 
                  component={Link} 
                  to={`${location.pathname}${item.page === 1 ? "" : `?page=${item.page}`}`} 
                  {...item}
                  sx={{
                    fontWeight: 600,
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "white",
                      border: "1px solid",
                      borderColor: "primary.light",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                    },
                  }}
                />
              )}
            />
            <TextField
              inputProps={{ 
                inputMode: "numeric", 
                pattern: "[0-9]*",
                "aria-label": "Go to page number"
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">Page</InputAdornment>,
              }}
              sx={{
                width: "140px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                }
              }}
              size="medium"
              type="text"
              onKeyDown={handleSubmit}
              placeholder={`1-${totalPages}`}
            />
          </Box>
        )}
      </Container>
      <Footer />
    </SimpleBar>
  );
}
