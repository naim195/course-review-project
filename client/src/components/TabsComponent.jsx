import { Tabs, Tab, Box } from "@mui/material";
import PropTypes from "prop-types";
import TabPanel from "./TabPanel";
import CourseGrid from "./CourseGrid";

function TabsComponent({
  activeTab,
  setActiveTab,
  tabHeaders,
  groupedCourses,
  handleCardClick,
}) {
  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="course tabs"
      >
        {tabHeaders.map((tabHeader, index) => (
          <Tab key={index} label={tabHeader} />
        ))}
      </Tabs>
      {tabHeaders.map((tabHeader, index) => (
        <TabPanel key={index} value={activeTab} index={index}>
          <CourseGrid
            courses={groupedCourses[tabHeader]}
            handleCardClick={handleCardClick}
          />
        </TabPanel>
      ))}
    </Box>
  );
}

TabsComponent.propTypes = {
  activeTab: PropTypes.number.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  tabHeaders: PropTypes.arrayOf(PropTypes.string).isRequired,
  groupedCourses: PropTypes.object.isRequired,
  handleCardClick: PropTypes.func.isRequired,
};

export default TabsComponent;
