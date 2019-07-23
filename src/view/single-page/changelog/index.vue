<template>
  <div>
    <Timeline>
      <TimelineItem>
        <p class="time">Zeus-1.0.0 (2019-07-27)</p>
        <div class="content">
          <ul>
            <li>完成用户系统的增删改查</li>
            <li>集成SpringSecurity+JWT认证</li>
            <li>完成角色的增删改查</li>
          </ul>
        </div>
      </TimelineItem>
      <TimelineItem>
        <p class="time">2019-07-01项目开始</p>
      </TimelineItem>
    </Timeline>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        logs: [

          {
            time: '2019-07-23',
            title: 'Zeus 1.0',
            contents: [{
              label:'Update',
              changeItems: [
                '测试A',
                '测试B',
              ]
            }]
          },

          {
            time: '2019-07-09',
            title: 'Zeus 0.0',
            contents: [{
              label:'Update',
              changeItems: [
                'A',
                'B',
              ]
            }]
          },







        ]
      }
    }
  }
</script>

<style lang="less">
  .time {
    font-size: 20px;
  }
  .content {
    padding-left: 25px;
  }

</style>
