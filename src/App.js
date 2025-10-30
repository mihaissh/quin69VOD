import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, styled } from "@mui/material";
import Loading from "./utils/Loading";
import createAppTheme from "./theme/theme";

const Vods = lazy(() => import("./vods/Vods"));
const Navbar = lazy(() => import("./navbar/navbar"));
const YoutubeVod = lazy(() => import("./vods/YoutubeVod"));
const Games = lazy(() => import("./games/Games"));
const CustomVod = lazy(() => import("./vods/CustomVod"));
const NotFound = lazy(() => import("./utils/NotFound"));

const channel = process.env.REACT_APP_CHANNEL,
  twitchId = process.env.REACT_APP_TWITCH_ID,
  VODS_API_BASE = process.env.REACT_APP_VODS_API_BASE;

export default function App() {
  const theme = createAppTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Parent>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="*" element={<NotFound channel={channel} />} />
              <Route
                exact
                path="/"
                element={
                  <>
                    <Navbar channel={channel} twitchId={twitchId} />
                    <Vods channel={channel} twitchId={twitchId} VODS_API_BASE={VODS_API_BASE} />
                  </>
                }
              />
              <Route
                exact
                path="/vods"
                element={
                  <>
                    <Navbar channel={channel} twitchId={twitchId} />
                    <Vods channel={channel} twitchId={twitchId} VODS_API_BASE={VODS_API_BASE} />
                  </>
                }
              />
              <Route exact path="/vods/:vodId" element={<><Navbar channel={channel} twitchId={twitchId} /><YoutubeVod channel={channel} twitchId={twitchId} type="vod" VODS_API_BASE={VODS_API_BASE} /></>} />
              <Route exact path="/live/:vodId" element={<><Navbar channel={channel} twitchId={twitchId} /><YoutubeVod channel={channel} twitchId={twitchId} type="live" VODS_API_BASE={VODS_API_BASE} /></>} />
              <Route exact path="/youtube/:vodId" element={<><Navbar channel={channel} twitchId={twitchId} /><YoutubeVod channel={channel} twitchId={twitchId} VODS_API_BASE={VODS_API_BASE} /></>} />
              <Route exact path="/games/:vodId" element={<><Navbar channel={channel} twitchId={twitchId} /><Games channel={channel} twitchId={twitchId} VODS_API_BASE={VODS_API_BASE} /></>} />
              <Route exact path="/manual/:vodId" element={<><Navbar channel={channel} twitchId={twitchId} /><CustomVod channel={channel} twitchId={twitchId} type="manual" VODS_API_BASE={VODS_API_BASE} /></>} />
            </Routes>
          </Suspense>
        </Parent>
      </BrowserRouter>
    </ThemeProvider>
  );
}

const Parent = styled((props) => <div {...props} />)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;
