/* eslint-disable react/prop-types */
import { Box, Grid, Paper, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";

export const PrincipalImgComponent = ({ events }) => {
  return (
    <Grid>
      <CarouselComponent events={events} />
    </Grid>
  );
};

function CarouselComponent({ events }) {
  const updatedEvents = events

    .map((event) => {
      const filteredImagen = event.imagen.filter(
        (url) => !url.includes("youtube")
      );
      return { ...event, imagen: filteredImagen };
    })
    .filter((event) => event.imagen.length > 0);

  var items = [
    {
      name: "Random Name #1",
      description:
        "Gira territorial de paz, escenarios de diálogo con organizaciones sociales, liderazgos comunales, campesinos, rurales y procesos de ciudad. Gira territorial de paz, escenarios de diálogo con organizaciones sociales, liderazgos comunales, campesinos, rurales y procesos de ciudad.",
      img: "https://pbs.twimg.com/media/FCVslvrXoAAIzS7.jpg:large",
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
      img: "https://pbs.twimg.com/media/FCVslvrXoAAIzS7.jpg:large",
    },
  ];

  return (
    <Carousel interval={10000} sx={{ width: "100%" }}>
      {updatedEvents.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </Carousel>
  );
}

function Item(props) {
  const handleClick = (id = 0) => {
    window.location.href = "/evento?id=" + id;
  };
  return (
    <Paper
      onClick={() => handleClick(props.item.id)}
      sx={{
        cursor: "pointer",
        position: "relative",
        backgroundColor: "grey.800",
        color: "#fff",
        mb: 4,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url(${props.item.imagen[0]})`,
        height: "80vh",
        display: "flex",
        alignItems: "flex-end",
        "@media (max-width: 425px)": { height: "100%", minHeight: "180px" },
      }}
    >
      {/* Increase the priority of the hero background image 'rgba(0,0,0,.5)' */}
      {
        <img
          style={{ display: "none" }}
          src={props.item.imagen[0]}
          alt={props.item.titulo}
        />
      }
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          background: "linear-gradient(rgba(0,0,0,.2), 70%,black)",
          display: "flex",
        }}
      />

      <Typography
        variant="body1"
        color="inherit"
        position={"relative"}
        textAlign={"left"}
        padding={"2%"}
      >
        {props.item.descripcion}
      </Typography>
    </Paper>
  );
}
