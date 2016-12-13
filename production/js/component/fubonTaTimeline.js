// var app = angular.module('fubon.ta.callin.app');
(function () {
	var timelineComponent = {
		templateUrl: 'fubon-ta-timeline.html',
		controller: timelineComponentCtrl,
		controllerAs: 'vm',
		bindings: {
			step: '@'
		}
	};
	callinApp.component('fubonTimeline', timelineComponent);

	function timelineComponentCtrl() {
		var vm = this;
	}
})();