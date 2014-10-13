/**
 * Created by vickidunlop on 11/10/2014.
 */

function Game() {
    var model = new GameModel();
    var view = new GameView();
    var controller = new GameController(model, view);

    view.init();
    view.setController(controller);
    model.setView(view);
}
