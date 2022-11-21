import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll,useTransform } from "framer-motion";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { useState,useEffect } from "react";
import { useNavigate, useMatch } from "react-router-dom";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 300px;
  overflow:hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>` //bgphoto를 prop으로 받아옵니다
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 50px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 20px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: grey;
  height: 200px;
  color: white;
  font-size: 66px;
  margin:5px;
  word-break: keep-all;
  font-size: 30px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  //첫번째는 오른쪽으로만, 마지막은 왼쪽으로만 커진다!
  &:first-child {
    transform-origin: center left; 
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.3, //시작할 때만 딜레이를 줌
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)< { scrolly: number} >`
  top: ${(props) => props.scrolly + 100}px;
  position: absolute;
  background: white;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;


const BigCover = styled.div< {bgphoto: string} >`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  background-image: linear-gradient(to top, black, transparent), url(${(props)=>props.bgphoto});
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const offset = 6;

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
      //key값, 변수명
    ["movies", "nowPlaying"],
    getMovies
  );

  const [index, setIndex] = useState(0);
  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;  //항상 가득 찬 페이지만 얻게 되는 수식

      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const [leaving, setLeaving] = useState(false); //두번 연속 클릭 방지
  const toggleLeaving = () => setLeaving((prev) => !prev);
  //애니메이션이 끝난 후에 다른 애니메이션실행 가능
  
  const navigator=useNavigate();
  //박스가 클릭되면 해당 url로 이동시킵니다
  const bigMovieMatch=useMatch("/movies/:movieId");
  //이 url과 같은 url이 맞는지 매칭합니다
  const onBoxClicked=(movieId:number)=> navigator(`/movies/${movieId}`); 
  const onOverlayClick = () => navigator("/");
  
  const nowUrlMovieId = parseInt(bigMovieMatch?.params.movieId!);
  const clickedMovie = nowUrlMovieId && data?.results.find((movie) => movie.id === nowUrlMovieId);
                      //url의 movieId가 data의 결과들 중 일부와 같다면 그 녀석을 출력해라~

  const { scrollY } = useScroll();
  const [scroll, setScroll]=useState(scrollY.get());
  //스크롤 포지션을 추적하여 어느 스크롤에 있던 화면 정중앙에 모달이 뜨게 하기 위함
  useEffect(() => { //위의 scrolly에 따라 nav의 색이 바뀌도록 한다
    scrollY.onChange(() => setScroll(scrollY.get()));
  }, [scrollY]);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={incraseIndex}
            bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
            //이건 prop으로 올라갑니다
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>                   
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row                       //animation이 끝나면 실행되는 함수
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {
                 data?.results
                 .slice(1) //맨 앞에 1개 잘라냄
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""} //bigmatch 애니메이션을 위해!
                      onClick={() => onBoxClicked(movie.id)}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
              <Overlay
              //bubbling을 막기 위해, 겉이 아닌 옆에 배치
                onClick={onOverlayClick}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              /> 
              <BigMovie
                scrolly={scroll} //어디에 위치하든 scroll을 읽어서 정중앙에 나오게 함
                layoutId={bigMovieMatch.params.movieId}
              >
               {clickedMovie && ( //clickedmovie가 null이 아니라면~
                    <>
                      <BigCover bgphoto= {makeImagePath(clickedMovie.backdrop_path,"w500")} />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
              </BigMovie>
            </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );}
  export default Home;